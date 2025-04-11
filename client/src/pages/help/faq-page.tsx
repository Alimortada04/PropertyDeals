import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Sample FAQ questions and answers
const faqData = [
  {
    id: "buying",
    category: "Buying",
    questions: [
      {
        id: "buying-1",
        question: "How do I know if I'm ready to buy a property?",
        answer: "Before buying a property, consider your financial situation, long-term plans, and the current market. You should have a stable income, good credit score, manageable debt, and enough savings for a down payment and closing costs. It's also important to determine if you plan to stay in the area for at least a few years to make the investment worthwhile."
      },
      {
        id: "buying-2",
        question: "What is the first step in the home buying process?",
        answer: "The first step in the home buying process is typically getting pre-approved for a mortgage. This involves a lender reviewing your financial information to determine how much they're willing to lend you. Getting pre-approved helps you understand your budget and shows sellers you're a serious buyer."
      },
      {
        id: "buying-3",
        question: "How much do I need for a down payment?",
        answer: "Down payment requirements vary depending on the type of loan and property. Conventional loans typically require 3-20% down, while FHA loans may require as little as 3.5%. VA and USDA loans might offer zero down payment options for qualified buyers. A larger down payment often results in better loan terms and lower monthly payments."
      }
    ]
  },
  {
    id: "selling",
    category: "Selling",
    questions: [
      {
        id: "selling-1",
        question: "When is the best time to sell my property?",
        answer: "The best time to sell depends on your local market conditions, personal circumstances, and financial goals. Spring and early summer are traditionally strong selling seasons in many markets, but factors like job growth, interest rates, and inventory levels in your specific area will impact the optimal timing."
      },
      {
        id: "selling-2",
        question: "How do I determine the value of my property?",
        answer: "To determine your property's value, you can get a professional appraisal, request a comparative market analysis (CMA) from a real estate agent, or research recent comparable sales in your area. Online valuation tools can provide rough estimates, but they often lack the accuracy of professional assessments that consider your property's specific features and condition."
      },
      {
        id: "selling-3",
        question: "What renovations should I make before selling?",
        answer: "Focus on high-return renovations that address major issues and improve first impressions. Kitchen and bathroom updates, fresh paint, improved curb appeal, and fixing obvious maintenance problems typically offer the best return. Avoid over-improving for your neighborhood, and consult with a real estate professional to identify the most valuable improvements for your specific market."
      }
    ]
  },
  {
    id: "investing",
    category: "Investing",
    questions: [
      {
        id: "investing-1",
        question: "What is the difference between flipping and buy-and-hold investing?",
        answer: "Flipping involves purchasing a property, renovating it, and quickly reselling it for profit, typically within a few months. It requires market knowledge, renovation expertise, and the ability to manage short-term risks. Buy-and-hold investing means purchasing property to generate ongoing rental income and long-term appreciation. This strategy requires property management skills and focuses on steady cash flow rather than quick profits."
      },
      {
        id: "investing-2",
        question: "How do I calculate ROI on a real estate investment?",
        answer: "ROI (Return on Investment) can be calculated by dividing the net profit by the total investment cost, then multiplying by 100 to get a percentage. For rental properties, calculate annual net income (rent minus expenses) and divide by your total investment (down payment, closing costs, renovation costs). For flips, subtract all costs (purchase price, renovation, holding costs, selling costs) from the sale price, then divide by your total costs."
      },
      {
        id: "investing-3",
        question: "What is the 1% rule in real estate investing?",
        answer: "The 1% rule is a quick screening tool for rental properties. It suggests that the monthly rent should be at least 1% of the property's purchase price to be considered a good investment. For example, a $200,000 property should rent for at least $2,000 per month. While helpful as an initial filter, this rule should be used alongside more comprehensive analyses that consider all income and expenses."
      }
    ]
  },
  {
    id: "financing",
    category: "Financing",
    questions: [
      {
        id: "financing-1",
        question: "What types of mortgages are available?",
        answer: "Common mortgage types include conventional loans (conforming to Fannie Mae and Freddie Mac guidelines), FHA loans (backed by the Federal Housing Administration with lower down payment requirements), VA loans (for veterans and service members), USDA loans (for rural properties), and jumbo loans (exceeding conforming loan limits). Each has different requirements for down payment, credit score, debt-to-income ratio, and property type."
      },
      {
        id: "financing-2",
        question: "How does my credit score affect my mortgage rate?",
        answer: "Your credit score significantly impacts your mortgage interest rate. Higher scores typically result in lower rates, which can save thousands over the life of the loan. Most lenders consider scores above 740 as excellent, 700-739 as good, 650-699 as fair, and below 650 as challenging. Even a small rate increase due to lower credit can substantially increase your monthly payment and total interest paid."
      },
      {
        id: "financing-3",
        question: "What costs are included in closing?",
        answer: "Closing costs typically range from 2-5% of the loan amount and include lender fees (application, origination, underwriting), third-party fees (appraisal, credit report, inspection, title search, survey), prepaid items (insurance, property taxes, interest), escrow account funding, and title insurance. Buyers and sellers can negotiate who pays certain costs, and some costs vary by location due to local taxes and regulations."
      }
    ]
  }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter function for FAQ items
  const filteredFAQs = faqData.map(category => {
    const filteredQuestions = category.questions.filter(
      item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return {
      ...category,
      questions: filteredQuestions,
      // Only show categories that have matching questions
      hasMatches: filteredQuestions.length > 0
    };
  }).filter(category => category.hasMatches);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#09261E] mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-8">
          Find answers to common questions about buying, selling, and investing in real estate.
        </p>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search questions..."
            className="pl-10 py-2 w-full border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FAQ Accordion */}
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((category) => (
            <div key={category.id} className="mb-8">
              <h2 className="text-xl font-semibold text-[#09261E] mb-4">{category.category}</h2>
              <Accordion type="single" collapsible className="bg-white rounded-lg shadow">
                {category.questions.map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="text-left px-4 hover:no-underline hover:bg-gray-50">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-gray-700">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-gray-600">
              We couldn't find any FAQs matching your search. Please try different keywords.
            </p>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-12 bg-[#EAF2EF] rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-[#09261E] mb-2">Still have questions?</h2>
          <p className="text-gray-700 mb-4">
            If you couldn't find the answer you're looking for, our support team is here to help.
          </p>
          <a 
            href="/help/report" 
            className="inline-flex items-center text-[#09261E] font-medium hover:underline"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}