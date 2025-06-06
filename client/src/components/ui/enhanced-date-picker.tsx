import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedDatePickerProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
  className?: string;
}

export function EnhancedDatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled,
  className
}: EnhancedDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(
              "w-full pl-3 text-left font-normal border-gray-300 hover:bg-gray-100 focus:border-[#09261E] focus:ring-[#09261E]",
              value
                ? "bg-[#09261E] text-white hover:bg-[#135341] border-[#09261E]"
                : "text-muted-foreground",
              className
            )}
          >
            {value ? (
              (() => {
                try {
                  const parsed = new Date(value);
                  return isNaN(parsed.getTime())
                    ? placeholder
                    : format(parsed, "MMMM do, yyyy");
                } catch {
                  return placeholder;
                }
              })()
            ) : (
              <span>{placeholder}</span>
            )}
            <Calendar className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            if (date) {
              const formatted = date.toISOString().split("T")[0]; // YYYY-MM-DD
              onChange(formatted);
            } else {
              onChange(null);
            }
          }}
          disabled={disabled || ((date) => date < new Date("1900-01-01"))}
          initialFocus
          className="rounded-md border"
          classNames={{
            day_selected:
              "bg-[#135341] text-white hover:bg-[#135341] focus:bg-[#135341] rounded-full h-9 w-9 p-0 flex items-center justify-center !bg-[#135341]",
            day_today: "bg-gray-100 text-gray-900",
            day: "hover:bg-gray-200 hover:text-gray-800 rounded-full transition-colors h-9 w-9 p-0 mx-0.5 flex items-center justify-center",
            cell: "[&:has([aria-selected])]:bg-transparent",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

// Simple wrapper component that can replace the entire FormField content
export function ClosingDateField({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="closingDate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Closing Date (Optional)</FormLabel>
          <EnhancedDatePicker
            value={field.value}
            onChange={field.onChange}
            placeholder="Select date"
          />
          <FormDescription>Expected closing date (if known)</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}