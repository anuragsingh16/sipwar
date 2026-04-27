/**
 * Sipwar Product Seed Script
 * Run with: npx ts-node -P tsconfig.json --skip-project scripts/seed-products.ts
 * Or: npm run seed (if configured in package.json)
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Inline minimal schema to avoid circular dep issues
const ProductSchema = new mongoose.Schema(
  {
    name:             { type: String, required: true },
    slug:             { type: String, required: true, unique: true },
    shortDescription: { type: String },
    fullDescription:  { type: String, required: true },
    category:         { type: String, enum: ["arabica", "robusta", "filter", "blend"], required: true },
    tags:             [String],
    variants: [
      {
        weight:          Number,
        grindType:       String,
        sku:             { type: String, required: true },
        price:           Number,
        discountedPrice: Number,
        stock:           { type: Number, default: 100 },
        isAvailable:     { type: Boolean, default: true },
      },
    ],
    origin: {
      region:   String,
      altitude: String,
      farmName: String,
      farmer:   String,
    },
    roastLevel:    { type: String, enum: ["light", "medium", "dark"] },
    tastingNotes:  [String],
    images: [
      {
        url:       { type: String, required: true },
        alt:       String,
        isPrimary: { type: Boolean, default: false },
      },
    ],
    certifications:        [String],
    badges:                [String],
    avgRating:             { type: Number, default: 0 },
    reviewCount:           { type: Number, default: 0 },
    salesCount:            { type: Number, default: 0 },
    subscriptionEligible:  { type: Boolean, default: false },
    isActive:              { type: Boolean, default: true },
    isFeatured:            { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PRODUCTS = [
  {
    name: "Filter Coffee Arabica AA",
    slug: "filter-coffee-arabica-aa",
    shortDescription: "Single-origin Coorg, bold & smooth",
    fullDescription:
      "Our flagship Arabica AA is sourced exclusively from shade-grown estates in Coorg, Karnataka, at elevations between 1,200–1,500m. Hand-harvested and wet-processed, it delivers a bold, chocolatey cup with a clean, smooth finish. Roasted to a medium profile to preserve the origin's natural sweetness.",
    category: "arabica",
    tags: ["arabica", "single-origin", "coorg", "bestseller", "medium-roast"],
    variants: [
      { weight: 250, grindType: "medium", sku: "ARA-AA-250M", price: 799, discountedPrice: 599, stock: 200, isAvailable: true },
      { weight: 500, grindType: "medium", sku: "ARA-AA-500M", price: 1399, discountedPrice: 1099, stock: 150, isAvailable: true },
      { weight: 1000, grindType: "medium", sku: "ARA-AA-1KGM", price: 2599, discountedPrice: 1999, stock: 100, isAvailable: true },
    ],
    origin: { region: "Coorg, Karnataka", altitude: "1,200–1,500m", farmName: "Kaveri Estates", farmer: "Ravi Kumar" },
    roastLevel: "medium",
    tastingNotes: ["Dark chocolate", "Caramel", "Toasted hazelnut", "Smooth finish"],
    images: [
      { url: "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Filter Coffee Arabica AA beans", isPrimary: true },
    ],
    certifications: ["Organic", "Rain Forest Alliance"],
    badges: ["Bestseller"],
    avgRating: 4.8,
    reviewCount: 240,
    salesCount: 1200,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Adaptogenic Morning Blend",
    slug: "adaptogenic-morning-blend",
    shortDescription: "Ashwagandha-infused, zero crash energy",
    fullDescription:
      "A revolutionary wellness coffee combining 100% Arabica from Coorg with 200mg KSM-66 Ashwagandha and 250mg Lion's Mane extract. Delivers sustained energy without the cortisol spike or caffeine crash. Smooth, chocolatey, and grounding — your morning routine, upgraded.",
    category: "blend",
    tags: ["adaptogen", "wellness", "ashwagandha", "lions-mane", "no-crash", "new"],
    variants: [
      { weight: 250, grindType: "medium", sku: "ADP-BLD-250M", price: 799, stock: 150, isAvailable: true },
      { weight: 500, grindType: "medium", sku: "ADP-BLD-500M", price: 1449, stock: 100, isAvailable: true },
      { weight: 1000, grindType: "medium", sku: "ADP-BLD-1KGM", price: 2699, stock: 60, isAvailable: true },
    ],
    origin: { region: "Coorg, Karnataka", altitude: "1,200m" },
    roastLevel: "medium",
    tastingNotes: ["Rich chocolate", "Earthy undertones", "Smooth body", "Clean finish"],
    images: [
      { url: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Adaptogenic Morning Blend", isPrimary: true },
    ],
    certifications: ["Organic", "Vegan"],
    badges: ["New", "Wellness"],
    avgRating: 4.9,
    reviewCount: 89,
    salesCount: 320,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Monsoon Malabar Dark Roast",
    slug: "monsoon-malabar-dark-roast",
    shortDescription: "Earthy, intense, and unforgettable",
    fullDescription:
      "A uniquely Indian experience — green Robusta beans from the Malabar Coast, deliberately exposed to monsoon winds for 12–16 weeks. This monsooning process transforms them into something extraordinary: swollen, low-acid beans with a wild, earthy complexity. Dark roasted to amplify the intensity.",
    category: "robusta",
    tags: ["robusta", "monsoon-malabar", "dark-roast", "intense", "unique"],
    variants: [
      { weight: 250, grindType: "medium", sku: "MON-MAL-250M", price: 499, stock: 180, isAvailable: true },
      { weight: 500, grindType: "medium", sku: "MON-MAL-500M", price: 929, stock: 120, isAvailable: true },
      { weight: 1000, grindType: "medium", sku: "MON-MAL-1KGM", price: 1749, stock: 80, isAvailable: true },
    ],
    origin: { region: "Malabar Coast, Karnataka", altitude: "700–1,000m" },
    roastLevel: "dark",
    tastingNotes: ["Earthy", "Dark chocolate", "Woodsy", "Spice", "Low acidity"],
    images: [
      { url: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Monsoon Malabar Dark Roast", isPrimary: true },
    ],
    certifications: ["Organic"],
    badges: [],
    avgRating: 4.7,
    reviewCount: 210,
    salesCount: 890,
    isFeatured: false,
    isActive: true,
  },
  {
    name: "Heritage South Indian Filter",
    slug: "heritage-south-indian-filter",
    shortDescription: "Traditional decoction concentrate",
    fullDescription:
      "An authentic 80:20 Arabica-Robusta blend, medium-fine ground specifically for the traditional South Indian brass filter. Zero chicory, delivering a richer, cleaner decoction than any commercial blend. The flavour of 'filter kaapi' as it was intended — bold, full-bodied, and deeply satisfying.",
    category: "filter",
    tags: ["filter", "south-indian", "traditional", "arabica-robusta", "sale"],
    variants: [
      { weight: 250, grindType: "fine", sku: "HER-FIL-250F", price: 449, discountedPrice: 349, stock: 300, isAvailable: true },
      { weight: 500, grindType: "fine", sku: "HER-FIL-500F", price: 829, discountedPrice: 649, stock: 200, isAvailable: true },
      { weight: 1000, grindType: "fine", sku: "HER-FIL-1KGF", price: 1549, discountedPrice: 1199, stock: 100, isAvailable: true },
    ],
    origin: { region: "Chikmagalur, Karnataka" },
    roastLevel: "medium",
    tastingNotes: ["Rich body", "Dark chocolate", "Caramel", "Smooth finish"],
    images: [
      { url: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Heritage South Indian Filter Coffee", isPrimary: true },
    ],
    certifications: ["Organic"],
    badges: ["Sale", "Traditional"],
    avgRating: 4.6,
    reviewCount: 340,
    salesCount: 1800,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Chikmagalur Estate Reserve",
    slug: "chikmagalur-estate-reserve",
    shortDescription: "Floral, bright, wine-processed Arabica",
    fullDescription:
      "A limited single-estate Arabica from Baba Budangiri, Chikmagalur — the birthplace of coffee in India. Natural (dry) processed to enhance its inherent fruitiness and floral complexity. Notes of jasmine, stone fruit, and a winey sweetness make this a truly special cup for the discerning palate.",
    category: "arabica",
    tags: ["arabica", "single-estate", "chikmagalur", "natural-process", "limited", "floral"],
    variants: [
      { weight: 250, grindType: "whole-bean", sku: "CHK-RSV-250WB", price: 699, stock: 80, isAvailable: true },
      { weight: 500, grindType: "whole-bean", sku: "CHK-RSV-500WB", price: 1299, stock: 50, isAvailable: true },
      { weight: 1000, grindType: "whole-bean", sku: "CHK-RSV-1KGWB", price: 2499, stock: 30, isAvailable: true },
    ],
    origin: { region: "Baba Budangiri, Chikmagalur", altitude: "1,400–2,000m", farmName: "Budangiri Heritage Estate" },
    roastLevel: "light",
    tastingNotes: ["Jasmine", "Stone fruit", "Berry", "Wine-like sweetness", "Bright acidity"],
    images: [
      { url: "https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Chikmagalur Estate Reserve pour over", isPrimary: true },
    ],
    certifications: ["Organic", "Shade Grown"],
    badges: ["Limited", "Award Winning"],
    avgRating: 4.9,
    reviewCount: 126,
    salesCount: 410,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Nilgiri Breakfast Blend",
    slug: "nilgiri-breakfast-blend",
    shortDescription: "Light, aromatic, perfect with milk",
    fullDescription:
      "A smooth, accessible morning blend from the Nilgiri hills of Tamil Nadu. Light-roasted to preserve the region's signature brightness and citrus aromatics. The perfect gateway coffee — works beautifully as a black pour-over or as a lightly milky morning staple. Consistent, clean, and deeply comforting.",
    category: "blend",
    tags: ["nilgiri", "light-roast", "breakfast", "aromatic", "citrus", "daily"],
    variants: [
      { weight: 250, grindType: "medium", sku: "NIL-BRK-250M", price: 449, stock: 200, isAvailable: true },
      { weight: 500, grindType: "medium", sku: "NIL-BRK-500M", price: 829, stock: 150, isAvailable: true },
      { weight: 1000, grindType: "medium", sku: "NIL-BRK-1KGM", price: 1549, stock: 100, isAvailable: true },
    ],
    origin: { region: "Nilgiris, Tamil Nadu", altitude: "1,200–1,800m" },
    roastLevel: "light",
    tastingNotes: ["Citrus", "Floral", "Light body", "Clean finish", "Bright"],
    images: [
      { url: "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=600", alt: "Nilgiri Breakfast Blend", isPrimary: true },
    ],
    certifications: ["Organic", "Fair Trade"],
    badges: [],
    avgRating: 4.5,
    reviewCount: 178,
    salesCount: 670,
    isFeatured: false,
    isActive: true,
  },
];

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI as string);
  console.log("✅ Connected");

  const Product =
    mongoose.models.Product || mongoose.model("Product", ProductSchema);

  console.log("🗑️  Clearing existing products...");
  await Product.deleteMany({});

  console.log("📦 Seeding 6 products...");
  for (const p of PRODUCTS) {
    await Product.create(p);
    console.log(`  ✅ ${p.name}`);
  }

  console.log("\n🎉 Seed complete! 6 products inserted.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
