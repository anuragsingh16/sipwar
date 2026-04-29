import mongoose, { Document, Model, Schema } from 'mongoose';
import Product from './Product';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  helpfulCount: number;
  reportCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    images: [{ type: String }],
    isVerifiedPurchase: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    helpfulCount: { type: Number, default: 0 },
    reportCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

ReviewSchema.statics.calcAverageRatings = async function (productId: mongoose.Types.ObjectId) {
  const stats = await this.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: '$productId',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      reviewCount: stats[0].nRating,
      avgRating: Math.round(stats[0].avgRating * 10) / 10 // round to 1 decimal
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      reviewCount: 0,
      avgRating: 0
    });
  }
};

ReviewSchema.post('save', function () {
  (this.constructor as any).calcAverageRatings(this.productId);
});

ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await (doc.constructor as any).calcAverageRatings(doc.productId);
  }
});

export interface IReviewModel extends Model<IReview> {
  calcAverageRatings(productId: mongoose.Types.ObjectId): Promise<void>;
}

export default (mongoose.models.Review as IReviewModel) || mongoose.model<IReview, IReviewModel>('Review', ReviewSchema);
