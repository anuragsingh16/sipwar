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

// POST /api/user/orders/[id]/cancel
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id?: string }).id;

  await dbConnect();
  const Order = getOrderModel();
  const order = await (Order as any).findById(id).lean() as Record<string, unknown> | null;

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (String(order.userId) !== String(userId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const cancellableStatuses = ["pending", "confirmed", "processing"];
  if (!cancellableStatuses.includes(String(order.orderStatus || order.status || "pending"))) {
    return NextResponse.json({ error: "Order cannot be cancelled at this stage" }, { status: 400 });
  }

  await (Order as any).findByIdAndUpdate(id, {
    orderStatus: "cancelled",
    status: "cancelled",
    paymentStatus: order.paymentStatus === "paid" ? "refunded" : "failed",
    cancelledAt: new Date(),
  });

  return NextResponse.json({ success: true, message: "Order cancelled successfully" });
}
