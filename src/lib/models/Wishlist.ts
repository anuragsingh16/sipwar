import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWishlistItem {
  productId?: mongoose.Types.ObjectId;
  productIdStr?: string;
  name?: string;
  price?: number;
  image?: string;
  variantId?: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [{ type: Schema.Types.Mixed }],
  },
  { timestamps: true }
);

if (mongoose.models.Wishlist) {
  delete mongoose.models.Wishlist;
}

export default mongoose.model<IWishlist>('Wishlist', WishlistSchema);
