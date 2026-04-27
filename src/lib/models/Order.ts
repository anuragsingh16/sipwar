import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  variantId: mongoose.Types.ObjectId;
  name: string;
  weight?: number;
  grindType?: string;
  quantity: number;
  pricePerUnit?: number;
  discount?: number;
  subtotal?: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  discount?: number;
  shippingCost?: number;
  tax?: number;
  total: number;
  couponCode?: string;
  couponDiscount?: number;
  shippingAddress?: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    landmark?: string;
  };
  billingAddress?: any;
  sameAsShipping: boolean;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  razorpay?: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled' | 'return-requested' | 'returned';
  tracking?: {
    carrier?: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
  };
  statusHistory: {
    status: string;
    timestamp: Date;
    note?: string;
    updatedBy?: mongoose.Types.ObjectId;
  }[];
  orderNotes?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variantId: { type: Schema.Types.ObjectId, required: true },
        name: String,
        weight: Number,
        grindType: String,
        quantity: { type: Number, required: true },
        pricePerUnit: Number,
        discount: Number,
        subtotal: Number,
      },
    ],
    subtotal: { type: Number, required: true },
    discount: Number,
    shippingCost: Number,
    tax: Number,
    total: { type: Number, required: true },
    couponCode: String,
    couponDiscount: Number,
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
      landmark: String,
    },
    billingAddress: Object,
    sameAsShipping: { type: Boolean, default: true },
    paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    razorpay: {
      orderId: { type: String, unique: true, sparse: true },
      paymentId: String,
      signature: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled', 'return-requested', 'returned'],
      default: 'pending',
      index: true,
    },
    tracking: {
      carrier: String,
      trackingNumber: String,
      estimatedDelivery: Date,
      actualDelivery: Date,
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    orderNotes: String,
    completedAt: Date,
  },
  { timestamps: true }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export default (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>('Order', OrderSchema);
