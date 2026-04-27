import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  emailVerified: boolean;
  profileImage?: string;
  authProvider: 'email' | 'google';
  googleId?: string;
  refreshToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    defaultAddress?: mongoose.Types.ObjectId;
  };
  loyaltyPoints: number;
  tier: 'bronze' | 'silver' | 'gold';
  role: 'user' | 'admin';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String },
    phone: { type: String, match: /^[0-9]{10}$/ },
    emailVerified: { type: Boolean, default: false },
    profileImage: String,
    authProvider: { type: String, enum: ['email', 'google'], default: 'email' },
    googleId: { type: String, unique: true, sparse: true },
    refreshToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    preferences: {
      newsletter: { type: Boolean, default: false },
      notifications: { type: Boolean, default: true },
      defaultAddress: { type: Schema.Types.ObjectId, ref: 'Address' },
    },
    loyaltyPoints: { type: Number, default: 0 },
    tier: { type: String, enum: ['bronze', 'silver', 'gold'], default: 'bronze' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
  },
  { timestamps: true }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
