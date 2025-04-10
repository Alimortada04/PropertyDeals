import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-gray-50">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#09261E] leading-tight mb-6">
            Discover and manage off-market real estate deals with confidence.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Find exclusive properties not available on traditional listings and connect directly with sellers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/properties">
              <Button size="lg" className="bg-[#09261E] hover:bg-[#135341] text-white px-6 py-4 text-lg font-medium">
                Browse Properties
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="bg-white hover:bg-gray-100 text-[#09261E] border-2 border-[#09261E] px-6 py-4 text-lg font-medium">
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 w-2/5 h-full bg-[#E59F9F]/10 hidden lg:block"></div>
    </section>
  );
}
