import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Briefcase, TrendingUp, Wrench, ExternalLink } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function ToolsTeaser() {
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer to trigger animations when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto-rotate active tool every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveToolIndex((prev) => (prev + 1) % tools.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const tools = [
    {
      title: "Flip Calculator",
      icon: <Calculator className="h-6 w-6" />,
      description: "Estimate renovation costs, holding expenses, and potential profit on fix and flip deals.",
      link: "/tools/flip-calculator",
      stats: [
        { value: "12%", label: "Average ROI" },
        { value: "$38K", label: "Avg. Profit" },
        { value: "6 mo", label: "Typical Hold" }
      ],
      color: "#09261E"
    },
    {
      title: "Seller Finance Calculator",
      icon: <Briefcase className="h-6 w-6" />,
      description: "Calculate payment schedules, interest, and total return for seller financed deals.",
      link: "/tools/seller-finance",
      stats: [
        { value: "8.2%", label: "Avg. Interest" },
        { value: "15 yr", label: "Avg. Term" },
        { value: "56%", label: "ROI Increase" }
      ],
      color: "#135341"
    },
    {
      title: "Sub-to Estimator",
      icon: <TrendingUp className="h-6 w-6" />,
      description: "Evaluate subject-to deals with mortgage assumption and cash flow projections.",
      link: "/tools/sub-to-estimator",
      stats: [
        { value: "$850", label: "Avg. Cash Flow" },
        { value: "4.2%", label: "Interest Rate" },
        { value: "3.5X", label: "Equity Multiplier" }
      ],
      color: "#803344"
    }
  ];

  const activeTool = tools[activeToolIndex];

  return (
    <section 
      ref={sectionRef} 
      className="py-20 bg-white overflow-hidden relative"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-[#F9F9F9] opacity-60"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-[#F9F9F9] opacity-60"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-xl mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#09261E] mb-4 relative">
              <span className="relative z-10">Investor Tools Built In</span>
              <span className="absolute bottom-1 left-0 h-3 w-24 bg-[#E59F9F]/30 -z-0"></span>
            </h2>
            <p className="text-gray-600 text-lg">
              PropertyDeals helps you run the numbers before you run the deal. Make confident decisions with our suite of investment calculators.
            </p>
          </div>
          <Link href="/tools">
            <Button className="flex items-center gap-2 bg-[#09261E] hover:bg-[#135341] text-white px-6 py-3 font-medium rounded-full shadow-md hover:shadow-lg transition-all">
              <Wrench className="h-5 w-5" />
              <span>Explore All Tools</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Main featured tool card */}
          <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <Card className="bg-gradient-to-br from-[#09261E] to-[#135341] text-white shadow-xl h-full flex flex-col overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mr-4">
                      {activeTool.icon}
                    </div>
                    <CardTitle className="text-2xl font-heading">{activeTool.title}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    {tools.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                          activeToolIndex === index ? "w-8 bg-white" : "w-2 bg-white/30"
                        }`}
                        onClick={() => setActiveToolIndex(index)}
                        aria-label={`View ${tools[index].title}`}
                      ></button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-white/80 mb-8 text-lg">{activeTool.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {activeTool.stats.map((stat, i) => (
                    <div key={i} className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-xl font-heading font-bold">{stat.value}</div>
                      <div className="text-white/70 text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                  <h4 className="font-medium mb-2">Why use this calculator?</h4>
                  <p className="text-white/80 text-sm">
                    Get accurate projections based on real market data. Save time analyzing deals and make confident investment decisions.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={activeTool.link} className="w-full">
                  <Button className="w-full bg-white hover:bg-gray-100 text-[#09261E] font-medium">
                    Try Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          {/* Tool list cards */}
          <div className="space-y-4">
            {tools.map((tool, index) => (
              <div 
                key={index} 
                className={`transform transition-all duration-700 delay-${index * 100} ${
                  isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
                }`}
              >
                <Card 
                  className={`border-l-4 hover:shadow-md transition-all duration-300 ${
                    activeToolIndex === index ? 'shadow-md' : ''
                  }`}
                  style={{ borderLeftColor: tool.color }}
                  onClick={() => setActiveToolIndex(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#09261E]/10 flex items-center justify-center mr-3">
                          {tool.icon}
                        </div>
                        <h3 className="font-heading font-bold text-lg text-[#09261E]">{tool.title}</h3>
                      </div>
                      <Link href={tool.link}>
                        <Button size="sm" variant="ghost" className="rounded-full">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-3">
                      {tool.stats.map((stat, i) => (
                        <div key={i} className="flex items-center bg-[#09261E]/5 rounded-full px-3 py-1">
                          <span className="text-xs font-medium text-[#09261E]">{stat.label}: </span>
                          <span className="text-xs ml-1 font-bold text-[#135341]">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {/* Add a testimonial card */}
            <div className={`transform transition-all duration-700 delay-300 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}>
              <Card className="bg-[#F9F9F9] border-none">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-[#E59F9F] text-4xl font-serif">"</div>
                    <div>
                      <p className="text-gray-700 italic mb-4">
                        These calculators saved me hours of analysis on my last flip. I was able to quickly determine my maximum offer price and renovation budget.
                      </p>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#135341] text-white flex items-center justify-center mr-2 text-xs font-bold">JD</div>
                        <span className="text-sm font-medium">John D., Real Estate Investor</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}