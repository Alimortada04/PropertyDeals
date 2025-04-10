import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-16 bg-[#09261E] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-6">Ready to find your next property?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of investors discovering off-market deals every day.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button className="bg-white hover:bg-gray-100 text-[#09261E] px-6 py-3 font-medium">
                Browse Properties
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="bg-transparent hover:bg-[#135341] text-white border-2 border-white px-6 py-3 font-medium">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
