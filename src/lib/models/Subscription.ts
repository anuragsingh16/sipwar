import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  variantId: mongoose.Types.ObjectId;
  quantity: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  nextDeliveryDate: Date;
  pricePerDelivery: number;
  addressId: mongoose.Types.ObjectId;
  razorpaySubscriptionId?: string;
  status: 'active' | 'paused' | 'cancelled';
  pausedUntil?: Date;
  deliveries: {
    orderId?: mongoose.Types.ObjectId;
    deliveredAt?: Date;
    status: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true, min: 1 },
    frequency: { type: String, enum: ['weekly', 'biweekly', 'monthly'], required: true },
    nextDeliveryDate: { type: Date, required: true },
    pricePerDelivery: { type: Number, required: true },
    addressId: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
    razorpaySubscriptionId: String,
    status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active' },
    pausedUntil: Date,
    deliveries: [
      {
        orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
        deliveredAt: Date,
        status: String,
      },
    ],
  },
  { timestamps: true }
);

export default (mongoose.models.Subscription as Model<ISubscription>) || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
