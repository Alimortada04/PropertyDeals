import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, DollarSign, Percent, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/common/breadcrumbs";

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
}

function ToolCard({ icon, title, description, path }: ToolCardProps) {
  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-[#09261E]/10 text-[#09261E]">
            {icon}
          </div>
        </div>
        <CardTitle className="text-center text-xl font-heading text-[#09261E]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-center text-gray-600">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-2 pb-4 flex justify-center">
        <Link href={path}>
          <Button className="bg-[#09261E] hover:bg-[#135341] text-white">
            Open Tool
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function ToolsPage() {
  const tools = [
    {
      icon: <Calculator size={32} strokeWidth={1.5} />,
      title: "Flip Calculator",
      description: "Estimate potential profit from residential property flips with costs breakdown.",
      path: "/tools/flip-calculator"
    },
    {
      icon: <DollarSign size={32} strokeWidth={1.5} />,
      title: "Investment Calculator",
      description: "Calculate ROI, cash flow, and cap rate for rental property investments.",
      path: "/tools/investment-calculator"
    },
    {
      icon: <GitCompare size={32} strokeWidth={1.5} />,
      title: "Sub-to Calculator",
      description: "Run numbers on subject-to deals with detailed payment schedules.",
      path: "/tools/subto-calculator"
    },
    {
      icon: <Percent size={32} strokeWidth={1.5} />,
      title: "Seller Finance Calculator",
      description: "Evaluate seller-financed deals and generate amortization schedules.",
      path: "/tools/seller-finance-calculator"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumbs />
      </div>
      
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#09261E] mb-4">
          Real Estate Investment Tools
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Powerful calculators to help you make informed investment decisions and analyze potential deals.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, index) => (
          <ToolCard 
            key={index}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            path={tool.path}
          />
        ))}
      </div>
    </div>
  );
}