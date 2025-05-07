import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HelpFAQ } from "./help-faq";
import { HelpSuggestions } from "./help-suggestions";
import { HelpReport } from "./help-report";

export function HelpCenterTabs() {
  const [activeTab, setActiveTab] = useState("faq");

  return (
    <Tabs 
      defaultValue="faq" 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="space-y-6"
    >
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
        <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        <TabsTrigger value="report">Report a Problem</TabsTrigger>
      </TabsList>
      
      <TabsContent value="faq" className="mt-6">
        <HelpFAQ />
      </TabsContent>
      
      <TabsContent value="suggestions" className="mt-6">
        <HelpSuggestions />
      </TabsContent>
      
      <TabsContent value="report" className="mt-6">
        <HelpReport />
      </TabsContent>
    </Tabs>
  );
}