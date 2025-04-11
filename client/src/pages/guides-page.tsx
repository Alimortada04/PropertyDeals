import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, FileText, BookOpen, Video } from "lucide-react";
import Breadcrumbs from "@/components/common/breadcrumbs";

interface GuideCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
}

function GuideCard({ icon, title, description, path }: GuideCardProps) {
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
            View Guide
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function GuidesPage() {
  const guides = [
    {
      icon: <BookOpen size={32} strokeWidth={1.5} />,
      title: "PropertyDictionary",
      description: "Comprehensive glossary of real estate terms and definitions for investors and professionals.",
      path: "/guides/property-dictionary"
    },
    {
      icon: <FileText size={32} strokeWidth={1.5} />,
      title: "Due Diligence Checklist",
      description: "Complete step-by-step checklist for thorough property research and evaluation.",
      path: "/guides/due-diligence"
    },
    {
      icon: <Book size={32} strokeWidth={1.5} />,
      title: "Investment Strategies",
      description: "Overview of popular real estate investment strategies with pros and cons of each approach.",
      path: "/guides/investment-strategies"
    },
    {
      icon: <Video size={32} strokeWidth={1.5} />,
      title: "Video Tutorials",
      description: "Watch step-by-step video tutorials on various aspects of real estate investing.",
      path: "/guides/video-tutorials"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#09261E] mb-4">
          Real Estate Guides & Resources
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Educational resources to help you navigate the real estate market with confidence.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {guides.map((guide, index) => (
          <GuideCard 
            key={index}
            icon={guide.icon}
            title={guide.title}
            description={guide.description}
            path={guide.path}
          />
        ))}
      </div>
    </div>
  );
}