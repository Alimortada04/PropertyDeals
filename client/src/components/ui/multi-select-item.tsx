import React from "react";
import { cn } from "@/lib/utils";

interface MultiSelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  children: React.ReactNode;
}

const MultiSelectItem = React.forwardRef<HTMLDivElement, MultiSelectItemProps>(
  ({ selected = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-3 py-1 text-sm transition-colors cursor-pointer select-none",
          selected
            ? "bg-[#09261E] text-white hover:bg-opacity-90"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MultiSelectItem.displayName = "MultiSelectItem";

export default MultiSelectItem;