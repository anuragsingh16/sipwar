import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/db/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import User from "@/lib/models/User";
import mongoose from "mongoose";

function getOrderModel() {
  if (mongoose.models.Order) return mongoose.models.Order;
  const schema = new mongoose.Schema({}, { strict: false, timestamps: true });
  return mongoose.model("Order", schema);
}

export async function POST(req: NextRequest) {
  try {
    // ── Auth check ──────────────────────────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to place an order." },
        { status: 401 }
      );
    }
    const userId = (session.user as { id?: string }).id || null;

    // ── Parse body ──────────────────────────────────────────────────────────
    const { items, address, totalAmount } = await req.json();

    if (!items?.length || !address || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const amountPaise = Math.round(totalAmount * 100);
    if (amountPaise < 100) {
      return NextResponse.json({ error: "Minimum order amount is ₹1" }, { status: 400 });
    }

    // ── Create Razorpay order ────────────────────────────────────────────────
    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const rzpOrder = await razorpay.orders.create({
      amount:   amountPaise,
      currency: "INR",
      receipt:  `rcpt_${Date.now()}`,
    });

    // ── Save pending order to MongoDB ────────────────────────────────────────
    await dbConnect();
    const OrderModel = getOrderModel();

    const dbOrder = await OrderModel.create({
      userId,
      items: items.map((i: any) => ({
        productId: i.productId || i.id,
        name:      i.name,
        price:     i.price,
        quantity:  i.quantity,
        weight:    i.weight,
        grind:     i.grind,
        image:     i.image,
        subtotal:  i.price * i.quantity,
      })),
      shippingAddress:  address,
      total:            totalAmount,
      totalAmount,
      subtotal:         totalAmount,
      paymentMethod:    "razorpay",
      paymentStatus:    "pending",
      status:           "pending",
      orderStatus:      "pending",
      razorpayOrderId:  rzpOrder.id,
      orderNumber:      `ORD-${Date.now()}`,
    });

    // ── Award Brew Points (1 pt per ₹100 spent) ──────────────────────────────
    if (userId) {
      try {
        const pointsEarned = Math.floor(totalAmount / 100);
        if (pointsEarned > 0) {
          await User.findByIdAndUpdate(userId, { $inc: { loyaltyPoints: pointsEarned } });
        }
      } catch (pointsErr) {
        console.error("Failed to update brew points:", pointsErr);
      }
    }

    // ── Respond ──────────────────────────────────────────────────────────────
    return NextResponse.json({
      order_id:    rzpOrder.id,
      amount:      rzpOrder.amount,
      currency:    rzpOrder.currency,
      dbOrderId:   dbOrder._id.toString(),
      orderNumber: dbOrder.orderNumber,
    });

  } catch (error: any) {
    const fs = require('fs');
    fs.writeFileSync('last-error.log', String(error?.stack || error));
    console.error("[create-order] Error:", error);
    return NextResponse.json(
      { error: (error?.error?.description || error?.message || String(error)) + " - check last-error.log" },
      { status: 500 }
    );
  }
}
