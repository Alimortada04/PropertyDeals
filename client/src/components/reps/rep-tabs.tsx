import { useState } from "react";
import { Rep } from "@/lib/rep-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RepCard from "./rep-card";

interface RepTabsProps {
  sellers: Rep[];
  contractors: Rep[];
  agents: Rep[];
  lenders: Rep[];
}

export default function RepTabs({ sellers, contractors, agents, lenders }: RepTabsProps) {
  const [activeTab, setActiveTab] = useState("sellers");
  
  return (
    <Tabs defaultValue="sellers" className="w-full" onValueChange={setActiveTab}>
      <div className="border-b border-gray-200 mb-6">
        <TabsList className="h-14 bg-transparent border-b-0 justify-center space-x-8">
          <TabsTrigger 
            value="sellers" 
            className={`text-lg font-heading font-medium pb-3 ${
              activeTab === "sellers" 
                ? "text-[#09261E] border-b-2 border-[#09261E]" 
                : "text-gray-500 hover:text-[#135341]"
            } bg-transparent hover:bg-transparent rounded-none transition-colors`}
          >
            Sellers
          </TabsTrigger>
          <TabsTrigger 
            value="contractors" 
            className={`text-lg font-heading font-medium pb-3 ${
              activeTab === "contractors" 
                ? "text-[#09261E] border-b-2 border-[#09261E]" 
                : "text-gray-500 hover:text-[#135341]"
            } bg-transparent hover:bg-transparent rounded-none transition-colors`}
          >
            Contractors
          </TabsTrigger>
          <TabsTrigger 
            value="agents" 
            className={`text-lg font-heading font-medium pb-3 ${
              activeTab === "agents" 
                ? "text-[#09261E] border-b-2 border-[#09261E]" 
                : "text-gray-500 hover:text-[#135341]"
            } bg-transparent hover:bg-transparent rounded-none transition-colors`}
          >
            Agents
          </TabsTrigger>
          <TabsTrigger 
            value="lenders" 
            className={`text-lg font-heading font-medium pb-3 ${
              activeTab === "lenders"
                ? "text-[#09261E] border-b-2 border-[#09261E]" 
                : "text-gray-500 hover:text-[#135341]"
            } bg-transparent hover:bg-transparent rounded-none transition-colors`}
          >
            Lenders
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="sellers" className="mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sellers.map(rep => (
            <RepCard key={rep.id} rep={rep} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="contractors" className="mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contractors.map(rep => (
            <RepCard key={rep.id} rep={rep} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="agents" className="mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {agents.map(rep => (
            <RepCard key={rep.id} rep={rep} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="lenders" className="mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lenders.map(rep => (
            <RepCard key={rep.id} rep={rep} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}