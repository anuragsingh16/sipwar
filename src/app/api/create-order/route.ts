import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/db/mongodb";
import mongoose from "mongoose";

function getOrderModel() {
  if (mongoose.models.Order) return mongoose.models.Order;
  const schema = new mongoose.Schema({}, { strict: false, timestamps: true });
  return mongoose.model("Order", schema);
}

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", receipt, items, address, totalAmount } = await req.json();

    // 1. Validation
    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Minimum amount is 100 paise (₹1)" }, { status: 400 });
    }

    // 2. Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // 3. Create Razorpay Order
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    // 4. Save Pending Order to Database
    await dbConnect();
    const OrderModel = getOrderModel();
    const dbOrder = await OrderModel.create({
      items,
      shippingAddress: address,
      total: totalAmount || (amount / 100),
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      status: "pending",
      razorpayOrderId: rzpOrder.id,
      orderNumber: `ORD-${Date.now()}`,
    });

    // 5. Return success to frontend
    return NextResponse.json({
      order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      dbOrderId: dbOrder._id,
      orderNumber: dbOrder.orderNumber,
    });
  } catch (error: any) {
    console.error("Razorpay Create Order Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
