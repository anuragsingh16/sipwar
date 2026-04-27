import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/lib/models/User";
import dbConnect from "@/lib/db/mongodb";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: true, message: "If that email is registered, we have sent a reset link to it." });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // TODO: Integrate Nodemailer to send /reset-password?token=${resetToken}
    
    return NextResponse.json({ success: true, message: "Reset link sent" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
