import { reps, getRepsByType } from "@/lib/rep-data";
import RepTabs from "@/components/reps/rep-tabs";

export default function RepsPage() {
  const sellers = getRepsByType('seller');
  const contractors = getRepsByType('contractor');
  const agents = getRepsByType('agent');
  const lenders = getRepsByType('lender');
  
  return (
    <>
      <section className="bg-[#F5F5F5] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#09261E] mb-4">
              Meet Our Real Estate Professionals
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Connect with trusted professionals who can help you buy, sell, renovate, 
              or finance your dream property.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <RepTabs 
              sellers={sellers}
              contractors={contractors}
              agents={agents}
              lenders={lenders}
            />
          </div>
        </div>
      </section>
    </>
  );
}