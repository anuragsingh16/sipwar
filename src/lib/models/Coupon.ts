import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  maxUsageTotal?: number;
  currentUsageTotal: number;
  maxUsagePerUser: number;
  startDate?: Date;
  endDate?: Date;
  applicableProducts: mongoose.Types.ObjectId[];
  applicableCategories: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: String,
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    minOrderValue: Number,
    maxDiscount: Number,
    maxUsageTotal: Number,
    currentUsageTotal: { type: Number, default: 0 },
    maxUsagePerUser: { type: Number, default: 1 },
    startDate: Date,
    endDate: Date,
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    applicableCategories: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Coupon as Model<ICoupon>) || mongoose.model<ICoupon>('Coupon', CouponSchema);
