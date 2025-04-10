export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-4">How PropertyDeals Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Connecting buyers with exclusive off-market properties and sellers with motivated buyers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-search text-[#09261E] text-2xl"></i>
            </div>
            <h3 className="text-xl font-heading font-bold text-[#135341] mb-3">Discover Deals</h3>
            <p className="text-gray-600">Browse exclusive off-market properties not available on traditional listing platforms.</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-handshake text-[#09261E] text-2xl"></i>
            </div>
            <h3 className="text-xl font-heading font-bold text-[#135341] mb-3">Connect Directly</h3>
            <p className="text-gray-600">Communicate with sellers directly, without intermediaries or unnecessary fees.</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-key text-[#09261E] text-2xl"></i>
            </div>
            <h3 className="text-xl font-heading font-bold text-[#135341] mb-3">Close Confidently</h3>
            <p className="text-gray-600">Get support throughout the transaction process from start to close.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
