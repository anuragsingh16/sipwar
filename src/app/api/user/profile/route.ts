import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

function getUserModel() {
  if (mongoose.models.User) return mongoose.models.User;
  const schema = new mongoose.Schema({}, { strict: false, timestamps: true });
  return mongoose.model("User", schema);
}

// GET /api/user/profile
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id?: string }).id;

  await dbConnect();
  const User = getUserModel();
  const user = await (User as any).findById(userId).select("-password -passwordResetToken -refreshToken").lean();
  return NextResponse.json({ user });
}

// PATCH /api/user/profile
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id?: string }).id;

  const body = await req.json();
  const { firstName, lastName, phone, currentPassword, newPassword } = body;

  await dbConnect();
  const User = getUserModel();

  const updates: Record<string, unknown> = {};
  if (firstName) updates.firstName = firstName.trim();
  if (lastName !== undefined) updates.lastName = lastName.trim();
  if (phone !== undefined) updates.phone = phone.trim();

  // Handle password change
  if (newPassword) {
    if (!currentPassword) return NextResponse.json({ error: "Current password required" }, { status: 400 });
    const user = await (User as any).findById(userId).lean() as Record<string, unknown> | null;
    if (!user?.password) return NextResponse.json({ error: "Password not set" }, { status: 400 });
    const valid = await bcrypt.compare(currentPassword, String(user.password));
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    if (newPassword.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    updates.password = await bcrypt.hash(newPassword, 12);
  }

  await (User as any).findByIdAndUpdate(userId, { $set: updates });
  return NextResponse.json({ success: true, message: "Profile updated successfully" });
}
