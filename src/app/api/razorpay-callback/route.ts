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
 * GET /api/razorpay-callback
 *
 * Razorpay redirects the USER'S browser here after hosted checkout completes.
 * Query params provided by Razorpay:
 *   razorpay_payment_id, razorpay_order_id, razorpay_signature (on success)
 *   razorpay_payment_link_status=cancelled (on cancel/failure)
 *
 * We also carry dbOrderId & amount through as extra params in the callback_url.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const razorpay_payment_id = searchParams.get("razorpay_payment_id") || "";
  const razorpay_order_id   = searchParams.get("razorpay_order_id") || "";
  const razorpay_signature  = searchParams.get("razorpay_signature") || "";
  const dbOrderId           = searchParams.get("dbOrderId") || "";
  const amount              = searchParams.get("amount") || "";

  // ── Failure / cancellation path ──────────────────────────────────────────
  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return NextResponse.redirect(
      new URL(`/checkout?error=payment_failed`, req.nextUrl.origin)
    );
  }

  // ── Verify HMAC signature ─────────────────────────────────────────────────
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const generated = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated !== razorpay_signature) {
    console.error("[razorpay-callback] Signature mismatch — possible tamper.");
    return NextResponse.redirect(
      new URL(`/checkout?error=signature_mismatch`, req.nextUrl.origin)
    );
  }

  // ── Mark order as paid + confirmed ───────────────────────────────────────
  try {
    await dbConnect();
    const OrderModel = getOrderModel();

    if (dbOrderId) {
      await (OrderModel as any).findByIdAndUpdate(dbOrderId, {
        $set: {
          paymentStatus:      "paid",
          status:             "confirmed",
          orderStatus:        "confirmed",
          razorpayPaymentId:  razorpay_payment_id,
          razorpaySignature:  razorpay_signature,
          paidAt:             new Date(),
        },
      });
    }
  } catch (err) {
    console.error("[razorpay-callback] DB update error:", err);
    // Still redirect to success — payment is confirmed by Razorpay, DB update
    // will be retried by the webhook.
  }

  // ── Redirect user to order success page ──────────────────────────────────
  return NextResponse.redirect(
    new URL(
      `/order-success?orderId=${dbOrderId}&amount=${amount}`,
      req.nextUrl.origin
    )
  );
}
