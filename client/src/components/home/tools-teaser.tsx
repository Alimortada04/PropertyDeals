import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Briefcase, TrendingUp } from "lucide-react";

export default function ToolsTeaser() {
  const tools = [
    {
      title: "Flip Calculator",
      icon: <Calculator className="h-6 w-6" />,
      description: "Estimate renovation costs, holding expenses, and potential profit on fix and flip deals.",
      link: "/tools/flip-calculator"
    },
    {
      title: "Seller Finance Calculator",
      icon: <Briefcase className="h-6 w-6" />,
      description: "Calculate payment schedules, interest, and total return for seller financed deals.",
      link: "/tools/seller-finance"
    },
    {
      title: "Sub-to Estimator",
      icon: <TrendingUp className="h-6 w-6" />,
      description: "Evaluate subject-to deals with mortgage assumption and cash flow projections.",
      link: "/tools/sub-to-estimator"
    }
  ];

  return (
    <section className="py-16 bg-[#F9F9F9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-4">
            Investor Tools Built In
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            PropertyDeals helps you run the numbers before you run the deal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {tools.map((tool, index) => (
            <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="w-12 h-12 bg-[#09261E]/10 rounded-full flex items-center justify-center">
                  {tool.icon}
                </div>
                <CardTitle className="text-xl font-heading text-[#135341]">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{tool.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={tool.link} className="w-full">
                  <Button variant="outline" className="w-full border-[#135341] text-[#135341] hover:bg-[#135341] hover:text-white">
                    Try Tool
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Link href="/tools">
            <Button className="bg-[#09261E] hover:bg-[#135341] text-white px-6 py-3 font-medium">
              Explore All Tools
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}