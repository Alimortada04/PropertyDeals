import React from "react";
import { cn } from "@/lib/utils";
import { BookOpen, Home, DollarSign, Users, Briefcase } from "lucide-react";

interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const tabs = [
    { id: "general", label: "General", icon: <BookOpen size={16} /> },
    { id: "buyers", label: "Buyers", icon: <Home size={16} /> },
    { id: "sellers", label: "Sellers", icon: <DollarSign size={16} /> },
    { id: "agents", label: "Agents", icon: <Users size={16} /> },
    { id: "contractors", label: "Contractors", icon: <Briefcase size={16} /> }
  ];

  return (
    <div className="bg-white border rounded-lg p-1 flex gap-1 mb-8 overflow-x-auto no-scrollbar max-w-fit mx-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all",
            activeTab === tab.id
              ? "bg-[#09261E] text-white"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <span className="flex-shrink-0">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}