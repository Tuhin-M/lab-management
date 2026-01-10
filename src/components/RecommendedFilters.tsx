
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendedFiltersProps {
  onFilterSelect: (filter: string) => void;
  recommendedFilters?: string[];
  className?: string;
  title?: string;
  combinedFilters?: boolean;
}

const RecommendedFilters = ({ 
  onFilterSelect, 
  recommendedFilters = [
    "Complete Blood Count",
    "Thyroid Profile",
    "Diabetes",
    "Lipid Profile",
    "Liver Function",
    "Vitamin Tests",
    "Hormone Tests"
  ],
  className = "mb-6",
  title = "Recommended Searches:",
  combinedFilters = false
}: RecommendedFiltersProps) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleSelect = (filter: string) => {
    if (combinedFilters) {
      setSelectedFilters(prev => 
        prev.includes(filter) 
          ? prev.filter(f => f !== filter)
          : [...prev, filter]
      );
    }
    onFilterSelect(filter);
  };

  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-sm font-bold mb-3 text-slate-600 uppercase tracking-wide">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {recommendedFilters.map((filter) => {
          const isSelected = selectedFilters.includes(filter);
          return (
            <Badge 
              key={filter}
              variant="outline" 
              className={cn(
                "px-4 py-2 text-sm font-semibold cursor-pointer rounded-full transition-all duration-200",
                combinedFilters 
                  ? isSelected
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700 hover:border-emerald-400 hover:shadow-md"
                  : "bg-white/80 backdrop-blur-sm border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-100"
              )}
              onClick={() => handleSelect(filter)}
            >
              {filter}
              {combinedFilters && (
                <span className={cn(
                  "ml-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  isSelected 
                    ? "bg-white text-primary" 
                    : "bg-emerald-200 text-emerald-700"
                )}>
                  {isSelected ? <Check className="h-3 w-3" /> : "+"}
                </span>
              )}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedFilters;
