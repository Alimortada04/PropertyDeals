import React, { useState } from 'react';
import { Check, ChevronDown, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface MultiSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onSelectionChange(selected.filter(item => item !== value));
    } else {
      onSelectionChange([...selected, value]);
    }
  };

  const removeOption = (value: string) => {
    onSelectionChange(selected.filter(item => item !== value));
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-white hover:bg-gray-100 transition-colors", className)}
        >
          <div className="flex flex-wrap gap-1 max-w-full">
            {selected.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              <>
                {selected.slice(0, 2).map((value) => {
                  const option = options.find(opt => opt.value === value);
                  return (
                    <div
                      key={value}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(value);
                      }}
                    >
                      {option?.label}
                      <X className="h-3 w-3 hover:bg-green-200 rounded" />
                    </div>
                  );
                })}
                {selected.length > 2 && (
                  <span className="text-gray-500 text-xs">+{selected.length - 2} more</span>
                )}
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white" align="start">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8"
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors",
                selected.includes(option.value) ? "bg-green-50 hover:bg-green-100" : ""
              )}
              onClick={() => toggleOption(option.value)}
            >
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-sm border border-gray-300",
                  selected.includes(option.value)
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white"
                )}
              >
                {selected.includes(option.value) && (
                  <Check className="h-3 w-3" />
                )}
              </div>
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500">
              No status options found
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}