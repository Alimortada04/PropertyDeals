import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#09261E]/90 to-[#09261E]/80">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 md:py-28 lg:py-36 relative z-10">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
            Be in the Room Where It Happens.
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Find exclusive off-market real estate deals and connect with trusted professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/properties">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-[#09261E] px-6 py-4 text-lg font-medium">
                Browse Properties
              </Button>
            </Link>
            <Link href="/reps">
              <Button variant="outline" size="lg" className="bg-transparent hover:bg-white/10 text-white border-2 border-white px-6 py-4 text-lg font-medium">
                Explore The REP Room
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute right-0 bottom-0 w-1/4 h-1/3 bg-[#E59F9F]/20 hidden lg:block transform rotate-45 translate-x-1/2 translate-y-1/2 rounded-full"></div>
    </section>
  );
}
