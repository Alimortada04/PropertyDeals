import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#09261E] mb-6">About PropertyDeals</h1>
            <p className="text-xl text-gray-600 mb-8">
              We're on a mission to revolutionize how people discover, buy, and sell off-market real estate.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  PropertyDeals was founded in 2020 by a team of real estate professionals and technology 
                  experts who recognized a significant gap in the market: the lack of a dedicated platform 
                  for off-market real estate deals.
                </p>
                <p>
                  Traditional listing services focus on properties that are already widely marketed, 
                  but we knew there was a wealth of opportunity in properties that never make it to 
                  those platforms. Our founding team set out to create a solution that would connect 
                  property owners directly with motivated buyers, without the excessive fees and 
                  complications of traditional real estate transactions.
                </p>
                <p>
                  Today, PropertyDeals has grown into a trusted platform for thousands of users across 
                  the country, facilitating millions in real estate transactions and providing unparalleled 
                  access to exclusive property opportunities.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#09261E] absolute top-0 -left-4 h-full w-full rounded-lg transform -rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Office Team Meeting" 
                className="rounded-lg relative z-10 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-6">Our Mission & Values</h2>
            <p className="text-gray-700">
              At PropertyDeals, we're guided by a clear mission and a set of core values that inform everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-[#09261E]/10 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-handshake text-[#09261E] text-2xl"></i>
              </div>
              <h3 className="text-xl font-heading font-bold text-[#09261E] mb-3">Transparency</h3>
              <p className="text-gray-700">
                We believe in complete transparency in all transactions. No hidden fees, no surprise costs, just clear communication from start to finish.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-[#09261E]/10 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-gem text-[#09261E] text-2xl"></i>
              </div>
              <h3 className="text-xl font-heading font-bold text-[#09261E] mb-3">Quality</h3>
              <p className="text-gray-700">
                We maintain high standards for every property on our platform, ensuring our users have access to only the best opportunities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-[#09261E]/10 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-lock text-[#09261E] text-2xl"></i>
              </div>
              <h3 className="text-xl font-heading font-bold text-[#09261E] mb-3">Trust</h3>
              <p className="text-gray-700">
                We're building long-term relationships based on trust, delivering consistent value to our community of buyers and sellers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-6">Meet Our Leadership Team</h2>
            <p className="text-gray-700">
              The experienced professionals driving innovation in real estate.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 relative mx-auto w-32 h-32 overflow-hidden rounded-full">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                  alt="Michael Johnson" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-[#09261E] mb-1">Michael Johnson</h3>
              <p className="text-[#135341] mb-3">CEO & Co-Founder</p>
              <p className="text-gray-600 text-sm">
                Former real estate investor with 15+ years experience in off-market acquisitions.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 relative mx-auto w-32 h-32 overflow-hidden rounded-full">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                  alt="Sarah Martinez" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-[#09261E] mb-1">Sarah Martinez</h3>
              <p className="text-[#135341] mb-3">COO & Co-Founder</p>
              <p className="text-gray-600 text-sm">
                Previously led operations at a major property management firm serving 5,000+ units.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 relative mx-auto w-32 h-32 overflow-hidden rounded-full">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                  alt="David Chen" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-[#09261E] mb-1">David Chen</h3>
              <p className="text-[#135341] mb-3">CTO</p>
              <p className="text-gray-600 text-sm">
                Tech industry veteran who previously built marketplace platforms used by millions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[#09261E] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold mb-6">What Our Users Say</h2>
            <p className="opacity-90">
              Don't just take our word for it – hear from the people who have found success with PropertyDeals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 p-8 rounded-lg">
              <div className="flex mb-4 text-[#E59F9F]">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="mb-6 opacity-90">
                "I found my dream investment property on PropertyDeals after months of searching traditional listings with no success. The off-market opportunity allowed me to negotiate directly with the seller and close quickly."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://randomuser.me/api/portraits/men/75.jpg" 
                    alt="Robert Wilson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-bold">Robert Wilson</h4>
                  <p className="text-sm opacity-75">Real Estate Investor</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 p-8 rounded-lg">
              <div className="flex mb-4 text-[#E59F9F]">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="mb-6 opacity-90">
                "As a seller, I was able to avoid the traditional listing process and still get a fair price for my property. The platform connected me with serious buyers and streamlined the entire process."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://randomuser.me/api/portraits/women/42.jpg" 
                    alt="Jennifer Adams" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-bold">Jennifer Adams</h4>
                  <p className="text-sm opacity-75">Property Owner</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 p-8 rounded-lg md:col-span-2 lg:col-span-1">
              <div className="flex mb-4 text-[#E59F9F]">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="mb-6 opacity-90">
                "PropertyDeals has transformed how we source properties for our real estate portfolio. The quality of listings and direct access to motivated sellers has dramatically improved our acquisition process."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Marcus Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-bold">Marcus Johnson</h4>
                  <p className="text-sm opacity-75">Real Estate Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-6">Ready to Join PropertyDeals?</h2>
            <p className="text-gray-600 mb-8">
              Start discovering off-market properties or list your own property to connect with motivated buyers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties">
                <Button size="lg" className="bg-[#09261E] hover:bg-[#135341] text-white">
                  Browse Properties
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="border-[#09261E] text-[#09261E]">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
