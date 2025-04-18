import React from "react";
import { cn } from "@/lib/utils";

interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const tabs = [
    { id: "all", label: "All" },
    { id: "buyers", label: "Buyers" },
    { id: "sellers", label: "Sellers" },
    { id: "reps", label: "REPs" }
  ];

  return (
    <div className="flex flex-wrap border-b border-gray-200 mb-8">
      <div className="flex overflow-x-auto py-1 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-4 py-2 font-medium text-sm transition-all ease-in-out duration-200 whitespace-nowrap",
              activeTab === tab.id
                ? "text-[#09261E] border-b-2 border-[#09261E]"
                : "text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-300"
            )}
          >
            {tab.id === "all" && "📚 "}
            {tab.id === "buyers" && "🏠 "}
            {tab.id === "sellers" && "💰 "}
            {tab.id === "reps" && "👤 "}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}