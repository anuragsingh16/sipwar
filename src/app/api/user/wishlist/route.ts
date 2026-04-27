import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Wishlist from "@/lib/models/Wishlist";
import User from "@/lib/models/User";

// GET — get user's wishlist
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const wishlist = await Wishlist.findOne({ userId: user._id }).lean();
    if (!wishlist) return NextResponse.json({ wishlist: [] });

    const formattedWishlist = (wishlist.items as any[]).map((item) => ({
      productId: item.productIdStr || String(item.productId || ""),
      name:      item.name  || "Product",
      price:     item.price || 0,
      image:     item.image || "",
      addedAt:   item.addedAt,
    }));

    return NextResponse.json({ wishlist: formattedWishlist });
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST — add to wishlist (stores product metadata directly — works with static catalogue)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId, name, price, image } = await req.json();
    if (!productId) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let wishlist = await Wishlist.findOne({ userId: user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: user._id, items: [] });
    }

    const alreadyExists = (wishlist.items as any[]).some(
      (item) =>
        (item.productIdStr && item.productIdStr === String(productId)) ||
        (item.productId && item.productId.toString() === String(productId))
    );

    if (!alreadyExists) {
      (wishlist.items as any[]).push({
        productIdStr: String(productId),
        name:  name  || "Product",
        price: price || 0,
        image: image || "",
        addedAt: new Date(),
      });
      wishlist.markModified('items');
      await wishlist.save();
    }

    return NextResponse.json({ success: true, count: wishlist.items.length });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE — remove from wishlist
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const wishlist = await Wishlist.findOne({ userId: user._id });
    if (wishlist) {
      wishlist.items = (wishlist.items as any[]).filter(
        (item) =>
          item.productIdStr !== String(productId) &&
          (!item.productId || item.productId.toString() !== String(productId))
      ) as typeof wishlist.items;
      wishlist.markModified('items');
      await wishlist.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
