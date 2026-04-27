import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

function getOrderModel() {
  if (mongoose.models.Order) return mongoose.models.Order;
  const schema = new mongoose.Schema({}, { strict: false, timestamps: true });
  return mongoose.model("Order", schema);
}

// GET /api/admin/stats — enhanced with chart data
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const OrderModel = getOrderModel();

  const [totalOrders, totalUsers, revenueAgg, recentOrders, ordersByStatus, last7DaysOrders] = await Promise.all([
    OrderModel.countDocuments(),
    User.countDocuments(),
    OrderModel.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    OrderModel.find().sort({ createdAt: -1 }).limit(10).lean(),
    // Orders by status for pie chart
    OrderModel.aggregate([
      { $group: { _id: { $ifNull: ["$orderStatus", "$status", "pending"] }, count: { $sum: 1 } } },
    ]),
    // Last 7 days revenue for line chart
    (async () => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const start = new Date(date); start.setHours(0, 0, 0, 0);
        const end = new Date(date); end.setHours(23, 59, 59, 999);
        const agg = await OrderModel.aggregate([
          { $match: { createdAt: { $gte: start, $lte: end }, paymentStatus: "paid" } },
          { $group: { _id: null, revenue: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
        ]);
        days.push({
          date: date.toLocaleDateString("en-IN", { weekday: "short" }),
          revenue: agg[0]?.revenue || 0,
          orders: agg[0]?.count || 0,
        });
      }
      return days;
    })(),
  ]);

  return NextResponse.json({
    totalOrders,
    totalUsers,
    totalRevenue: revenueAgg[0]?.total || 0,
    recentOrders,
    ordersByStatus: ordersByStatus.map((s: { _id: string; count: number }) => ({ status: s._id || "pending", count: s.count })),
    last7Days: last7DaysOrders,
  });
}
