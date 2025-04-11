import React from "react";

export default function FHACompliancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#09261E] mb-6">FHA Compliance Statement</h1>
        
        <div className="prose prose-green max-w-none">
          <p className="text-lg text-gray-700 mb-8">
            Last updated: April 11, 2025
          </p>
          
          <div className="bg-[#EAF2EF] p-6 rounded-lg border border-[#09261E] mb-8">
            <p className="text-[#09261E] font-medium">
              PropertyDeals is committed to compliance with the Fair Housing Act and equal opportunity in housing. All properties listed on our platform are available without regard to race, color, religion, national origin, sex, disability, or familial status.
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Fair Housing Act Commitment</h2>
          <p>
            PropertyDeals is fully committed to the principles of the Fair Housing Act (FHA) and actively promotes fair housing practices. We recognize the importance of providing equal access to housing opportunities for all individuals, regardless of protected characteristics.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Policies</h2>
          <p>
            In adherence to the Fair Housing Act, PropertyDeals prohibits discrimination in the sale, rental, or financing of housing based on race, color, national origin, religion, sex, familial status, or disability. We have implemented the following policies to ensure compliance:
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Property Listings</h3>
          <p>
            All property listings on our platform must comply with fair housing laws. We do not allow discriminatory language, preferences, or limitations in property descriptions, photos, or any other content related to listings.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Advertising Practices</h3>
          <p>
            Our advertising practices are designed to reach a diverse audience and avoid targeting or excluding groups based on protected characteristics.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">User Conduct</h3>
          <p>
            All users of our platform, including real estate professionals, property owners, buyers, and renters, are expected to comply with fair housing laws in their interactions and transactions.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Reporting Discrimination</h2>
          <p>
            If you believe you have experienced housing discrimination while using our platform, we encourage you to report it immediately. You may:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Contact our Fair Housing Compliance team at fairhousing@propertydeals.com</li>
            <li>Submit a report through our platform's reporting feature</li>
            <li>File a complaint with the U.S. Department of Housing and Urban Development (HUD) at www.hud.gov/fairhousing</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Accessibility</h2>
          <p>
            PropertyDeals is committed to making our platform accessible to individuals with disabilities. We strive to implement the Web Content Accessibility Guidelines (WCAG) and continuously improve the accessibility of our services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Training and Education</h2>
          <p>
            We provide training and educational resources on fair housing laws and practices to all our employees and affiliated real estate professionals. This includes information on avoiding discriminatory language, recognizing fair housing violations, and promoting equal housing opportunities.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
          <p>
            For questions, concerns, or to report potential fair housing violations, please contact our Fair Housing Compliance team at fairhousing@propertydeals.com or call us at (800) 555-FAIR.
          </p>
        </div>
      </div>
    </div>
  );
}