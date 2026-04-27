import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  gallery: string[];
  category: 'brewing' | 'education' | 'stories' | 'health';
  tags: string[];
  author: {
    name: string;
    bio?: string;
    avatar?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
  };
  readTime?: number;
  viewCount: number;
  status: 'draft' | 'published';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    content: { type: String, required: true },
    featuredImage: String,
    gallery: [String],
    category: { type: String, enum: ['brewing', 'education', 'stories', 'health'], required: true },
    tags: [String],
    author: {
      name: { type: String, required: true },
      bio: String,
      avatar: String,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    readTime: Number,
    viewCount: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: Date,
  },
  { timestamps: true }
);

export default (mongoose.models.Blog as Model<IBlog>) || mongoose.model<IBlog>('Blog', BlogSchema);
