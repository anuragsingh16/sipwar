import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db/mongodb";
import mongoose from "mongoose";

function getOrderModel() {
  if (mongoose.models.Order) return mongoose.models.Order;
  const schema = new mongoose.Schema({}, { strict: false, timestamps: true });
  return mongoose.model("Order", schema);
}

/**
 * POST /api/razorpay-webhook
 *
 * Add this URL in Razorpay Dashboard → Webhooks:
 *   https://your-domain.com/api/razorpay-webhook
 *
 * Events to subscribe: payment.captured
 *
 * Webhook secret: set RAZORPAY_WEBHOOK_SECRET in your env vars
 * (create one in Razorpay dashboard → Webhooks → Secret)
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  // ── Verify webhook signature ──────────────────────────────────────────────
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (webhookSecret) {
    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSig !== signature) {
      console.error("[webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    console.warn("[webhook] RAZORPAY_WEBHOOK_SECRET not set — skipping signature check");
  }

  // ── Parse payload ─────────────────────────────────────────────────────────
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = payload?.event;

  // ── Handle payment.captured ───────────────────────────────────────────────
  if (event === "payment.captured") {
    const payment = payload?.payload?.payment?.entity;
    const razorpayOrderId = payment?.order_id;
    const razorpayPaymentId = payment?.id;

    if (!razorpayOrderId) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    try {
      await dbConnect();
      const OrderModel = getOrderModel();

      // Find by razorpayOrderId and update — idempotent so safe to run twice
      const result = await (OrderModel as any).findOneAndUpdate(
        { razorpayOrderId },
        {
          $set: {
            paymentStatus:     "paid",
            status:            "confirmed",
            orderStatus:       "confirmed",
            razorpayPaymentId,
            paidAt:            new Date(),
          },
        },
        { new: true }
      );

      if (!result) {
        console.warn(`[webhook] Order not found for razorpayOrderId=${razorpayOrderId}`);
      } else {
        console.log(`[webhook] Order confirmed: ${result._id} (${razorpayOrderId})`);
      }
    } catch (err) {
      console.error("[webhook] DB error:", err);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  // Always respond 200 so Razorpay doesn't retry on unhandled events
  return NextResponse.json({ received: true });
}
