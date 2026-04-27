import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db/mongodb";
import Wishlist from "@/lib/models/Wishlist";
import User from "@/lib/models/User";
import mongoose from "mongoose";

function getOrderModel() {
  if (mongoose.models.Order) return mongoose.models.Order;
  const schema = new mongoose.Schema({}, { strict: false, timestamps: true });
  return mongoose.model("Order", schema);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use the same flexible OrderModel used when saving — avoids schema mismatch
    const OrderModel = getOrderModel();
    const userId = user._id.toString();

    // Query orders by userId string (how they are saved from session)
    const totalOrders = await OrderModel.countDocuments({ userId });

    // Wishlist count
    const wishlist = await Wishlist.findOne({ userId: user._id });
    const wishlistItems = wishlist ? wishlist.items.length : 0;

    // Brew Points from user record (updated at order creation time)
    const brewPoints = user.loyaltyPoints || 0;

    return NextResponse.json({ totalOrders, wishlistItems, brewPoints });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
