import { Link } from "wouter";
import {
  HelpCircle,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import Breadcrumbs from "@/components/common/breadcrumbs";

interface HelpCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
}

function HelpCard({ icon, title, description, path }: HelpCardProps) {
  return (
    <Link href={path}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 h-full">
        <div className="flex flex-col h-full">
          <div className="text-[#09261E] mb-4">
            {icon}
          </div>
          <h3 className="text-xl font-semibold mb-2 text-[#09261E]">{title}</h3>
          <p className="text-gray-600 flex-grow">{description}</p>
          <div className="mt-4 pt-2 border-t border-gray-100">
            <span className="text-sm font-medium text-[#09261E] hover:underline inline-flex items-center">
              Visit page
              <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HelpPage() {
  const helpResources = [
    {
      icon: <HelpCircle className="h-10 w-10" />,
      title: "Frequently Asked Questions",
      description: "Find answers to common questions about buying, selling, and investing in real estate.",
      path: "/help/faq"
    },
    {
      icon: <MessageSquare className="h-10 w-10" />,
      title: "Suggestions",
      description: "Submit your ideas for new features or improvements to the PropertyDeals platform.",
      path: "/help/suggestions"
    },
    {
      icon: <AlertTriangle className="h-10 w-10" />,
      title: "Report a Problem",
      description: "Encountered an issue? Let us know so we can fix it as quickly as possible.",
      path: "/help/report"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#09261E] mb-2">Help Center</h1>
          <p className="text-gray-600">
            Get the support you need with our help resources, submit feedback, or report issues with the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {helpResources.map((resource, index) => (
            <HelpCard
              key={index}
              icon={resource.icon}
              title={resource.title}
              description={resource.description}
              path={resource.path}
            />
          ))}
        </div>

        <div className="mt-12 bg-[#EAF2EF] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#09261E] mb-4">Can't find what you're looking for?</h2>
          <p className="text-gray-700 mb-6">
            Our support team is here to help you with any questions or concerns that aren't addressed in our help resources.
          </p>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-[#09261E] mb-2">Contact Support</h3>
            <p className="text-sm text-gray-600 mb-3">
              Business hours: Monday to Friday, 9 AM - 5 PM ET
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <button className="w-full sm:w-auto px-4 py-2 bg-[#09261E] text-white rounded hover:bg-[#135341] transition-colors">
                  Contact Us
                </button>
              </Link>
              <a 
                href="mailto:support@propertydeals.com"
                className="w-full sm:w-auto px-4 py-2 border border-[#09261E] text-[#09261E] rounded hover:bg-gray-50 transition-colors text-center"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}