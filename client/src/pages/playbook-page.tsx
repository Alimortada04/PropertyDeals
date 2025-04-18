import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { 
  Book, 
  FileText, 
  BookOpen, 
  Video, 
  BarChart3, 
  Briefcase, 
  FileCheck, 
  HelpCircle,
  Search
} from "lucide-react";
import Breadcrumbs from "@/components/common/breadcrumbs";
import PlaybookCard, { PlaybookResource } from "@/components/playbook/playbook-card";
import TabNav from "@/components/playbook/tab-nav";

export default function PlaybookPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResources, setFilteredResources] = useState<PlaybookResource[]>([]);

  // All resources for the Playbook
  const playBookResources: PlaybookResource[] = [
    {
      id: "property-dictionary",
      icon: <BookOpen size={18} strokeWidth={1.5} />,
      title: "PropertyDictionary",
      description: "Comprehensive glossary of real estate terms and definitions for investors and professionals.",
      path: "/playbook/property-dictionary",
      audience: ["general"],
      updatedAt: "2 days ago",
      isTrending: true,
      coverImage: "https://images.unsplash.com/photo-1634655377962-e6e7b730e04d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVhbCUyMGVzdGF0ZSUyMHRlcm1zfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "due-diligence",
      icon: <FileCheck size={18} strokeWidth={1.5} />,
      title: "Due Diligence Checklist",
      description: "Complete step-by-step checklist for thorough property research and evaluation.",
      audience: ["general"],
      isComingSoon: true,
      coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hlY2tsaXN0JTIwcHJvcGVydHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "investment-strategies",
      icon: <BarChart3 size={18} strokeWidth={1.5} />,
      title: "Investment Strategies",
      description: "Overview of popular real estate investment strategies with pros and cons of each approach.",
      audience: ["general"],
      isComingSoon: true,
      coverImage: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJlYWwlMjBlc3RhdGUlMjBpbnZlc3RtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "video-tutorials",
      icon: <Video size={18} strokeWidth={1.5} />,
      title: "Video Tutorials",
      description: "Watch step-by-step video tutorials on various aspects of real estate investing.",
      audience: ["general"],
      isComingSoon: true,
      coverImage: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmlkZW8lMjB0dXRvcmlhbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "creative-financing",
      icon: <Book size={18} strokeWidth={1.5} />,
      title: "Creative Financing Guide",
      description: "Explore alternative financing methods beyond traditional mortgages for your real estate investments.",
      audience: ["buyers", "reps"],
      isComingSoon: true,
      coverImage: "https://images.unsplash.com/photo-1589666564459-92e970d690e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vcnRnYWdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "disposition-guide",
      icon: <Briefcase size={18} strokeWidth={1.5} />,
      title: "Disposition & Buyer Building Playbook",
      description: "Strategies for sellers to maximize property value and build a reliable buyer network.",
      audience: ["sellers", "reps"],
      isComingSoon: true,
      coverImage: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "property-walkthrough",
      icon: <FileText size={18} strokeWidth={1.5} />,
      title: "How to Walk a Property Guide",
      description: "Learn how to effectively evaluate properties during inspections and identify potential issues.",
      audience: ["sellers", "reps"],
      isComingSoon: true,
      coverImage: "https://images.unsplash.com/photo-1606676539940-12768ce0e762?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG9tZSUyMGluc3BlY3Rpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "ethics-compliance",
      icon: <HelpCircle size={18} strokeWidth={1.5} />,
      title: "Ethics & Compliance Center",
      description: "Resources on real estate ethics, legal requirements, and maintaining compliance.",
      audience: ["sellers", "reps"],
      isComingSoon: true,
      coverImage: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxhd3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "deal-anatomy",
      icon: <BarChart3 size={18} strokeWidth={1.5} />,
      title: "Live Deal Anatomy / Case Studies",
      description: "Detailed analysis of successful real estate deals with lessons learned and key takeaways.",
      audience: ["general"],
      isComingSoon: true,
      coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVhbCUyMGVzdGF0ZSUyMGFuYWx5c2lzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    }
  ];

  // Filter resources based on active tab and search term
  useEffect(() => {
    let results = [...playBookResources];
    
    // Filter by audience tab - only showing resources specifically for that audience
    results = results.filter(resource => resource.audience.includes(activeTab));
    
    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      results = results.filter(resource => 
        resource.title.toLowerCase().includes(term) || 
        resource.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredResources(results);
  }, [activeTab, searchTerm]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // You could also update the URL fragment for sharing/bookmarking
    window.location.hash = tab;
  };

  // Initialize from URL hash if present
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (["general", "buyers", "sellers", "reps"].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 pt-20">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumbs />
      </div>
      
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#09261E] mb-4">
          PropertyPlaybook: Real Estate Resources
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Educational resources to help you navigate the real estate market with confidence.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search resources..."
            className="pl-10 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Tab Navigation */}
      <TabNav activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Resource Cards Grid with Animations */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredResources.map((resource, index) => (
            <div 
              key={resource.id} 
              className={`animate-fadeInUp`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PlaybookCard resource={resource} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No resources found matching your criteria. Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}