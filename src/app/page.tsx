import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import KnowYourCoffee from "@/components/home/KnowYourCoffee";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandPhilosophy from "@/components/home/BrandPhilosophy";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <KnowYourCoffee />
      <FeaturedProducts />
      <BrandPhilosophy />
      <Testimonials />
    </>
  );
}
