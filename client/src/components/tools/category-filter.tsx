import React from "react";
import { cn } from "@/lib/utils";
import { Calculator, Home, DollarSign, TrendingUp, Building } from "lucide-react";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { id: "all", label: "All Tools", icon: <Calculator size={16} /> },
    { id: "flips", label: "Flips", icon: <TrendingUp size={16} /> },
    { id: "buyhold", label: "Buy & Hold", icon: <Home size={16} /> },
    { id: "creative", label: "Creative Finance", icon: <DollarSign size={16} /> },
    { id: "wholesale", label: "Wholesale", icon: <DollarSign size={16} /> },
    { id: "str", label: "STR", icon: <Building size={16} /> }
  ];

  return (
    <div className="bg-white border rounded-lg p-1 flex gap-1 mb-8 overflow-x-auto no-scrollbar max-w-fit mx-auto">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap",
            activeCategory === category.id
              ? "bg-[#09261E] text-white"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <span className="flex-shrink-0">{category.icon}</span>
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  );
}