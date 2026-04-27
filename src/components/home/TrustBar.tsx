import { Leaf, Truck, Users, Award } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Award, text: "100% Arabica & Robusta AA", sub: "Premium Grade Only" },
  { icon: Leaf, text: "Ethically Sourced", sub: "Certified Direct Trade" },
  { icon: Users, text: "500+ Farmer Partners", sub: "Across 5 States" },
  { icon: Truck, text: "Free Shipping ₹500+", sub: "Pan-India Delivery" },
];

export default function TrustBar() {
  return (
    <div className="bg-coffee-900 py-10">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-coffee-700">
          {TRUST_ITEMS.map(({ icon: Icon, text, sub }, i) => (
            <div key={i} className="flex flex-col items-center text-center py-4 gap-3">
              <div className="w-12 h-12 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-gold" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-white text-sm tracking-wide leading-tight">{text}</p>
                <p className="text-coffee-400 text-xs mt-1 font-medium">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
