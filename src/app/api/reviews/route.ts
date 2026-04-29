import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db/mongodb";
import Review from "@/lib/models/Review";
import Order from "@/lib/models/Order";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    await dbConnect();
    const reviews = await Review.find({ productId, status: { $ne: 'rejected' } })
      .populate("userId", "firstName lastName profileImage")
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { productId, rating, title, comment } = body;

    if (!productId || !rating || !title || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Check if user already reviewed
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 });
    }

    // Check if verified purchase
    const order = await Order.findOne({ 
      userId, 
      "items.productId": productId,
      paymentStatus: "paid"
    });

    const review = await Review.create({
      productId,
      userId,
      rating,
      title,
      comment,
      isVerifiedPurchase: !!order,
      status: 'approved' // Auto-approve for now
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
