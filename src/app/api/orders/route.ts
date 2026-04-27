import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import User from "@/lib/models/User";
import mongoose from "mongoose";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  weight?: string;
  grind?: string;
  image?: string;
}

function getOrderModel() {
  if (mongoose.models.Order) return mongoose.models.Order;
  const schema = new mongoose.Schema({}, { strict: false, timestamps: true });
  return mongoose.model("Order", schema);
}

async function saveOrder(
  userId: string | null,
  items: CartItem[],
  address: Record<string, string>,
  totalAmount: number,
  rzpOrderId: string,
  paymentMethod: string = "cod"
) {
  const OrderModel = getOrderModel();

  return await OrderModel.create({
    userId,
    items: items.map((i) => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      weight: i.weight,
      grind: i.grind,
      subtotal: i.price * i.quantity,
    })),
    // Use correct field names matching the Order schema
    total: totalAmount,
    totalAmount,          // keep for legacy queries
    subtotal: totalAmount,
    shippingAddress: address,
    paymentMethod,
    paymentStatus: "pending",
    // Use both field names so existing queries & new queries both work
    status: "pending",
    orderStatus: "pending",
    razorpayOrderId: rzpOrderId,
    orderNumber: `ORD-${Date.now()}`,
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items, address, totalAmount, paymentMethod = "cod" } = body;

    if (!items?.length || !address || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    let rzpOrderId = `COD-${Date.now()}`;
    let amount = Math.round(totalAmount * 100);
    let currency = "INR";

    // Only attempt Razorpay if keys are configured and not bypassed
    const hasRazorpay =
      process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      !body.bypassPayment &&
      paymentMethod !== "cod";

    if (hasRazorpay) {
      try {
        const Razorpay = (await import("razorpay")).default;
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID!,
          key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100),
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        });
        rzpOrderId = rzpOrder.id;
        amount = Number(rzpOrder.amount);
        currency = rzpOrder.currency;
      } catch (rzpErr) {
        console.error("Razorpay order creation failed, falling back to COD:", rzpErr);
      }
    }

    const userId = session?.user ? (session.user as { id?: string }).id || null : null;
    const dbOrder = await saveOrder(userId, items, address, totalAmount, rzpOrderId, paymentMethod);

    // Award Brew Points — 1 point per ₹100 spent
    if (userId) {
      try {
        const pointsEarned = Math.floor(totalAmount / 100);
        await User.findByIdAndUpdate(userId, { $inc: { loyaltyPoints: pointsEarned } });
      } catch (pointsErr) {
        console.error("Failed to update brew points:", pointsErr);
      }
    }

    return NextResponse.json({
      id: rzpOrderId,
      currency,
      amount,
      dbOrderId: dbOrder._id,
      orderNumber: dbOrder.orderNumber,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/orders — user's own orders
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id?: string }).id;

  await dbConnect();
  const OrderModel = getOrderModel();
  const orders = await OrderModel.find({ userId } as any).sort({ createdAt: -1 }).limit(20).lean();
  return NextResponse.json({ orders });
}

