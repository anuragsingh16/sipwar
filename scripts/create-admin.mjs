/**
 * Sipwar Admin Creation Script
 * Run: node scripts/create-admin.mjs
 * 
 * Requires MONGODB_URI in .env.local
 */

import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Parse .env.local manually (no dotenv dependency needed)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
const envVars = Object.fromEntries(
  envContent
    .split("\n")
    .filter(line => line.includes("=") && !line.trim().startsWith("#"))
    .map(line => {
      const idx = line.indexOf("=");
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const MONGODB_URI = envVars["MONGODB_URI"];
if (!MONGODB_URI || MONGODB_URI.includes("YOUR_USER")) {
  console.error("\n❌ ERROR: MONGODB_URI is not set in .env.local");
  console.error("   Please add your real MongoDB Atlas connection string first.\n");
  process.exit(1);
}

// Dynamically import mongoose
const { default: mongoose } = await import("mongoose");
const { default: bcrypt } = await import("bcryptjs");

const ADMIN_EMAIL    = "anuragrajput874@gmail.com";
const ADMIN_PASSWORD = "123456";
const ADMIN_NAME     = { firstName: "Anurag", lastName: "Rajput" };

const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const User = mongoose.models.User || mongoose.model("User", UserSchema);

console.log("\n🔌 Connecting to MongoDB...");
await mongoose.connect(MONGODB_URI);
console.log("✅ Connected!\n");

const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

if (existing) {
  // Promote existing user to admin
  await User.updateOne(
    { email: ADMIN_EMAIL.toLowerCase() },
    {
      $set: {
        role: "admin",
        password: hashedPassword,
        firstName: ADMIN_NAME.firstName,
        lastName:  ADMIN_NAME.lastName,
        isActive: true,
        emailVerified: true,
      }
    }
  );
  console.log(`✅ Existing user promoted to ADMIN:`);
} else {
  // Create new admin user
  await User.create({
    email: ADMIN_EMAIL.toLowerCase(),
    password: hashedPassword,
    firstName: ADMIN_NAME.firstName,
    lastName:  ADMIN_NAME.lastName,
    role: "admin",
    authProvider: "email",
    isActive: true,
    emailVerified: true,
    loyaltyPoints: 0,
    tier: "gold",
    preferences: { newsletter: false, notifications: true },
  });
  console.log(`✅ New ADMIN user created:`);
}

console.log(`   📧 Email:    ${ADMIN_EMAIL}`);
console.log(`   🔑 Password: ${ADMIN_PASSWORD}`);
console.log(`   👑 Role:     admin\n`);
console.log("👉 Login at: http://localhost:3000/admin-login\n");

await mongoose.disconnect();
