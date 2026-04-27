import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

function getOrderModel() {
  if (mongoose.models.Order) return mongoose.models.Order;
  const schema = new mongoose.Schema({}, { strict: false, timestamps: true });
  return mongoose.model("Order", schema);
}

// GET /api/admin/orders — all orders, paginated
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const status = searchParams.get("status");

  await dbConnect();
  const Order = getOrderModel();

  const query: any = status && status !== "all" ? { $or: [{ orderStatus: status }, { status }] } : {};
  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Order.countDocuments(query),
  ]);

  return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
}

// PATCH /api/admin/orders — update order status
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, orderStatus, paymentStatus } = await req.json();
  await dbConnect();
  const Order = getOrderModel();

  const updates: Record<string, unknown> = {};
  if (orderStatus) { updates.orderStatus = orderStatus; updates.status = orderStatus; }
  if (paymentStatus) updates.paymentStatus = paymentStatus;

  await (Order as any).findByIdAndUpdate(orderId, { $set: updates });
  return NextResponse.json({ success: true });
}
