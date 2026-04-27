import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProductVariant {
  _id?: mongoose.Types.ObjectId;
  weight: number;
  grindType?: 'whole-bean' | 'fine' | 'medium' | 'coarse';
  sku: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  isAvailable: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription: string;
  category: 'arabica' | 'robusta' | 'filter' | 'blend';
  tags: string[];
  variants: IProductVariant[];
  origin?: {
    region?: string;
    altitude?: string;
    farmName?: string;
    farmer?: string;
  };
  roastLevel?: 'light' | 'medium' | 'dark';
  tastingNotes: string[];
  healthBenefits: {
    title: string;
    description: string;
    icon?: string;
  }[];
  brewingGuide?: {
    method?: string;
    grindSize?: string;
    waterTemp?: string;
    ratio?: string;
    brewTime?: string;
    steps: string[];
  };
  images: {
    url: string;
    alt?: string;
    isPrimary: boolean;
  }[];
  certifications: string[];
  badges: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
  };
  avgRating: number;
  reviewCount: number;
  viewCount: number;
  salesCount: number;
  subscriptionEligible: boolean;
  isActive: boolean;
  isFeatured: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String, maxlength: 160 },
    fullDescription: { type: String, required: true },
    category: { type: String, enum: ['arabica', 'robusta', 'filter', 'blend'], required: true, index: true },
    tags: [{ type: String }],
    variants: [
      {
        weight: { type: Number, required: true },
        grindType: { type: String, enum: ['whole-bean', 'fine', 'medium', 'coarse'] },
        sku: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        discountedPrice: Number,
        stock: { type: Number, default: 0 },
        isAvailable: { type: Boolean, default: true },
      },
    ],
    origin: {
      region: String,
      altitude: String,
      farmName: String,
      farmer: String,
    },
    roastLevel: { type: String, enum: ['light', 'medium', 'dark'] },
    tastingNotes: [String],
    healthBenefits: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],
    brewingGuide: {
      method: String,
      grindSize: String,
      waterTemp: String,
      ratio: String,
      brewTime: String,
      steps: [String],
    },
    images: [
      {
        url: { type: String, required: true },
        alt: String,
        isPrimary: { type: Boolean, default: false },
      },
    ],
    certifications: [String],
    badges: [String],
    seo: {
      metaTitle: { type: String, maxlength: 60 },
      metaDescription: { type: String, maxlength: 160 },
      keywords: [String],
    },
    avgRating: { type: Number, default: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    subscriptionEligible: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    publishedAt: Date,
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ avgRating: -1 });
ProductSchema.index({ salesCount: -1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ 'variants.sku': 1 }, { unique: true, sparse: true });
ProductSchema.index({ name: 'text', shortDescription: 'text', tags: 'text' });

export default (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);
