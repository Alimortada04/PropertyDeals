import { Search, Users, Zap } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-4">How PropertyDeals Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connecting buyers with exclusive off-market properties and trusted professionals to close deals faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-[#09261E] h-7 w-7" />
            </div>
            <h3 className="text-xl font-heading font-bold text-[#135341] mb-3">Discover Deals</h3>
            <p className="text-gray-600">Browse exclusive off-market properties not available on traditional listing platforms.</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-[#09261E] h-7 w-7" />
            </div>
            <h3 className="text-xl font-heading font-bold text-[#135341] mb-3">Connect with REPs</h3>
            <p className="text-gray-600">Build relationships with real estate professionals who can help move your deals forward.</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="text-[#09261E] h-7 w-7" />
            </div>
            <h3 className="text-xl font-heading font-bold text-[#135341] mb-3">Close Faster</h3>
            <p className="text-gray-600">Use our built-in tools and community resources to evaluate and close deals efficiently.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
