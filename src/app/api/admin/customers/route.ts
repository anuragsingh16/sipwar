import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

function getUserModel() {
  if (mongoose.models.User) return mongoose.models.User;
  const schema = new mongoose.Schema({}, { strict: false, timestamps: true });
  return mongoose.model("User", schema);
}

function getOrderModel() {
  if (mongoose.models.Order) return mongoose.models.Order;
  const schema = new mongoose.Schema({}, { strict: false, timestamps: true });
  return mongoose.model("Order", schema);
}

// GET /api/admin/customers — paginated user list with order stats
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page  = parseInt(searchParams.get("page")  || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const q     = searchParams.get("q") || "";

  await dbConnect();
  const UserModel  = getUserModel();
  const OrderModel = getOrderModel();

  const filter: any = q
    ? {
        $or: [
          { email:     { $regex: q, $options: "i" } },
          { firstName: { $regex: q, $options: "i" } },
          { lastName:  { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    UserModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    UserModel.countDocuments(filter),
  ]);

  // Attach order stats per user (aggregate over found user IDs)
  const userIds = users.map((u: any) => u._id.toString());
  const orderStats = await OrderModel.aggregate([
    { $match: { userId: { $in: userIds } } },
    {
      $group: {
        _id:         "$userId",
        orderCount:  { $sum: 1 },
        totalSpend:  { $sum: "$totalAmount" },
      },
    },
  ]);

  const statsMap: Record<string, { orderCount: number; totalSpend: number }> = {};
  for (const s of orderStats) {
    statsMap[s._id] = { orderCount: s.orderCount, totalSpend: s.totalSpend };
  }

  const enriched = users.map((u: any) => ({
    _id:        u._id,
    firstName:  u.firstName || "",
    lastName:   u.lastName  || "",
    email:      u.email     || "",
    role:       u.role      || "user",
    isActive:   u.isActive  !== false,
    createdAt:  u.createdAt,
    lastLogin:  u.lastLogin,
    orderCount: statsMap[u._id.toString()]?.orderCount || 0,
    totalSpend: statsMap[u._id.toString()]?.totalSpend  || 0,
  }));

  return NextResponse.json({
    customers:  enriched,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
