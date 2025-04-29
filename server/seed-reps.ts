import { db } from './db';
import { reps } from '@shared/schema';

// Convert from our client-side rep data format to the database schema format
const seedReps = async () => {
  try {
    // First get the count of existing reps to avoid duplicate inserts
    const existingReps = await db.select({ count: { expr: reps.id, fn: 'count' } }).from(reps);
    const count = Number(existingReps[0]?.count || 0);
    
    if (count > 0) {
      console.log(`Database already contains ${count} reps. Skipping seeding.`);
      return;
    }
    
    // Array of new REPs to insert
    const repsData = [
      {
        name: "Alexander Rivera",
        role: "Property Inspector",
        locationCity: "Tampa",
        locationState: "FL",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
        yearsExperience: 14,
        rating: 4.9,
        reviewCount: 182,
        specialties: ["Residential Inspections", "Commercial Inspections", "Foundation Analysis"],
        bio: "With over 14 years of experience and 1,000+ inspections completed, I provide thorough and detailed property inspections throughout the Tampa Bay area. My background in structural engineering allows me to identify issues that others might miss.",
        slug: "alexander-rivera",
        entityType: "individual",
        isVerified: true
      },
      {
        name: "Natalie Wong",
        role: "Property Appraiser",
        locationCity: "Portland",
        locationState: "OR",
        avatar: "https://randomuser.me/api/portraits/women/38.jpg",
        yearsExperience: 11,
        rating: 4.7,
        reviewCount: 93,
        specialties: ["Residential Appraisals", "Investment Properties", "Refinancing"],
        bio: "As a certified residential appraiser with 11 years of experience in the Portland metro area, I provide accurate and objective property valuations. My reports are detailed, timely, and comply with all industry standards and regulations.",
        slug: "natalie-wong",
        entityType: "individual",
        isVerified: true
      },
      {
        name: "Platinum Lending Solutions",
        role: "Mortgage Lender",
        locationCity: "Boston",
        locationState: "MA",
        avatar: "https://logo.clearbit.com/platinumlending.com",
        yearsExperience: 18,
        rating: 4.8,
        reviewCount: 215,
        specialties: ["Conventional Loans", "Jumbo Loans", "First-time Buyer Programs"],
        bio: "Platinum Lending Solutions has been helping Boston area residents secure the best mortgage rates for nearly two decades. Our team of experienced loan officers specializes in finding the perfect financing solution for every client's unique situation.",
        slug: "platinum-lending-solutions",
        entityType: "business",
        isVerified: true,
        businessName: "Platinum Lending Solutions",
        teamSize: 12
      },
      {
        name: "Jason Thomas",
        role: "General Contractor",
        locationCity: "Atlanta",
        locationState: "GA",
        avatar: "https://randomuser.me/api/portraits/men/33.jpg",
        yearsExperience: 20,
        rating: 4.9,
        reviewCount: 178,
        specialties: ["Home Renovations", "Additions", "Kitchen & Bath Remodels"],
        bio: "With 20 years of experience in residential construction and renovation, I lead a team of skilled craftsmen who take pride in quality workmanship. From full home renovations to targeted upgrades, we deliver projects on time and on budget.",
        slug: "jason-thomas",
        entityType: "individual",
        isVerified: true
      },
      {
        name: "Green Thumb Landscaping",
        role: "Landscaper",
        locationCity: "San Diego",
        locationState: "CA",
        avatar: "https://logo.clearbit.com/greenthumblandscaping.com",
        yearsExperience: 15,
        rating: 4.8,
        reviewCount: 123,
        specialties: ["Drought-Resistant Design", "Outdoor Living Spaces", "Property Enhancement"],
        bio: "Green Thumb Landscaping specializes in creating beautiful, sustainable outdoor spaces throughout San Diego County. Our designs not only enhance your property's curb appeal but also increase its value while being environmentally conscious.",
        slug: "green-thumb-landscaping",
        entityType: "business",
        isVerified: true,
        businessName: "Green Thumb Landscaping",
        foundedYear: 2008,
        teamSize: 8
      },
      {
        name: "Elite Moving Solutions",
        role: "Mover",
        locationCity: "Dallas",
        locationState: "TX",
        avatar: "https://logo.clearbit.com/elitemoving.com",
        yearsExperience: 12,
        rating: 4.7,
        reviewCount: 256,
        specialties: ["Residential Moves", "Commercial Relocations", "Packing Services"],
        bio: "Elite Moving Solutions provides stress-free moving experiences for residential and commercial clients throughout the Dallas-Fort Worth metroplex. Our professional team handles every aspect of your move with care and efficiency.",
        slug: "elite-moving-solutions",
        entityType: "business",
        isVerified: true,
        businessName: "Elite Moving Solutions",
        foundedYear: 2011,
        teamSize: 24
      },
      {
        name: "Rachel Kim",
        role: "Real Estate Attorney",
        locationCity: "New York",
        locationState: "NY",
        avatar: "https://randomuser.me/api/portraits/women/42.jpg",
        yearsExperience: 16,
        rating: 4.9,
        reviewCount: 87,
        specialties: ["Residential Closings", "Commercial Transactions", "Lease Agreements"],
        bio: "As a real estate attorney with 16 years of experience in New York's complex property market, I help clients navigate legal aspects of buying, selling, and leasing with confidence. My thorough approach ensures your interests are protected.",
        slug: "rachel-kim",
        entityType: "individual",
        isVerified: true
      },
      {
        name: "Marcus Johnson",
        role: "Property Manager",
        locationCity: "Chicago",
        locationState: "IL",
        avatar: "https://randomuser.me/api/portraits/men/86.jpg",
        yearsExperience: 10,
        rating: 4.6,
        reviewCount: 143,
        specialties: ["Residential Properties", "Tenant Screening", "Maintenance Coordination"],
        bio: "I provide comprehensive property management services for investors and property owners throughout Chicago. My team handles everything from tenant screening and rent collection to maintenance coordination and financial reporting.",
        slug: "marcus-johnson",
        entityType: "individual",
        isVerified: true
      },
      {
        name: "Priscilla Nguyen",
        role: "Interior Designer",
        locationCity: "Houston",
        locationState: "TX",
        avatar: "https://randomuser.me/api/portraits/women/62.jpg",
        yearsExperience: 13,
        rating: 4.8,
        reviewCount: 176,
        specialties: ["Residential Design", "Staging for Sale", "Space Optimization"],
        bio: "With an eye for detail and a passion for creating beautiful, functional spaces, I help homeowners and sellers transform their properties. Whether preparing a home for sale or designing your dream space, I create environments that inspire.",
        slug: "priscilla-nguyen",
        entityType: "individual",
        isVerified: true
      },
      {
        name: "Cornerstone Home Inspection",
        role: "Inspection Company",
        locationCity: "Minneapolis",
        locationState: "MN",
        avatar: "https://logo.clearbit.com/cornerstoneinspection.com",
        yearsExperience: 22,
        rating: 4.9,
        reviewCount: 304,
        specialties: ["Buyer Inspections", "Seller Pre-Listing Inspections", "New Construction"],
        bio: "Cornerstone Home Inspection has been providing Twin Cities residents with thorough, reliable property inspections for over two decades. Our team of certified inspectors delivers detailed reports with clear recommendations so you can make informed decisions.",
        slug: "cornerstone-home-inspection",
        entityType: "business",
        isVerified: true,
        businessName: "Cornerstone Home Inspection",
        foundedYear: 2001,
        teamSize: 15
      },
      {
        name: "Robert Patel",
        role: "Mortgage Broker",
        locationCity: "Philadelphia",
        locationState: "PA",
        avatar: "https://randomuser.me/api/portraits/men/63.jpg",
        yearsExperience: 17,
        rating: 4.8,
        reviewCount: 211,
        specialties: ["FHA Loans", "VA Loans", "Refinancing"],
        bio: "As a mortgage broker with access to multiple lenders, I help my clients secure the most favorable loan terms possible. My knowledge of various loan programs allows me to match each client with the perfect financing option for their situation.",
        slug: "robert-patel",
        entityType: "individual",
        isVerified: true
      },
      {
        name: "Sunshine Title & Escrow",
        role: "Title Company",
        locationCity: "Orlando",
        locationState: "FL",
        avatar: "https://logo.clearbit.com/sunshinetitle.com",
        yearsExperience: 25,
        rating: 4.7,
        reviewCount: 189,
        specialties: ["Title Insurance", "Closing Services", "Document Preparation"],
        bio: "Sunshine Title & Escrow provides comprehensive title services throughout Central Florida. Our experienced team ensures smooth, secure closings by addressing potential title issues before they become problems for your transaction.",
        slug: "sunshine-title-escrow",
        entityType: "business",
        isVerified: true,
        businessName: "Sunshine Title & Escrow",
        foundedYear: 1998,
        teamSize: 22
      },
      {
        name: "Patricia Scott",
        role: "Luxury Property Specialist",
        locationCity: "Scottsdale",
        locationState: "AZ",
        avatar: "https://randomuser.me/api/portraits/women/24.jpg",
        yearsExperience: 19,
        rating: 4.9,
        reviewCount: 135,
        specialties: ["Luxury Estates", "Golf Properties", "Desert Retreats"],
        bio: "Specializing in Scottsdale's most prestigious neighborhoods, I provide white-glove service to clients seeking exceptional properties. My exclusive network and marketing expertise ensure that your luxury property receives the attention it deserves.",
        slug: "patricia-scott",
        entityType: "individual",
        isVerified: true
      },
      {
        name: "Daniel Taylor",
        role: "Commercial Leasing Agent",
        locationCity: "Seattle",
        locationState: "WA",
        avatar: "https://randomuser.me/api/portraits/men/82.jpg",
        yearsExperience: 14,
        rating: 4.7,
        reviewCount: 104,
        specialties: ["Office Space", "Retail Leasing", "Industrial Properties"],
        bio: "I help businesses find the perfect commercial space to support their growth and operations. With extensive knowledge of Seattle's commercial real estate market, I negotiate favorable lease terms that protect my clients' interests and support their business goals.",
        slug: "daniel-taylor",
        entityType: "individual",
        isVerified: true
      },
      {
        name: "Alexandra Wilson",
        role: "Home Stager",
        locationCity: "Nashville",
        locationState: "TN",
        avatar: "https://randomuser.me/api/portraits/women/16.jpg",
        yearsExperience: 8,
        rating: 4.8,
        reviewCount: 167,
        specialties: ["Vacant Home Staging", "Occupied Home Staging", "Virtual Staging"],
        bio: "I transform properties to highlight their full potential and appeal to the broadest range of buyers. My staging designs create emotional connections that help homes sell faster and for higher prices in Nashville's competitive market.",
        slug: "alexandra-wilson",
        entityType: "individual",
        isVerified: false
      }
    ];
    
    // Insert the data
    await db.insert(reps).values(repsData);
    
    console.log(`Successfully inserted ${repsData.length} REPs into the database.`);
  } catch (error) {
    console.error('Error seeding REPs:', error);
  }
};

// Only run this script directly (not when imported)
if (require.main === module) {
  seedReps()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Failed to seed database:', error);
      process.exit(1);
    });
}

export { seedReps };