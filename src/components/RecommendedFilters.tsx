
import React from "react";
import { Badge } from "@/components/ui/badge";

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
  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-sm font-medium mb-2 text-muted-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {recommendedFilters.map((filter) => (
          <Badge 
            key={filter}
            variant="outline" 
            className={`px-3 py-1 bg-white cursor-pointer hover:bg-primary hover:text-white border-primary/30 text-primary ${combinedFilters ? 'flex items-center' : ''}`}
            onClick={() => onFilterSelect(filter)}
          >
            {filter}
            {combinedFilters && (
              <span className="ml-1 bg-primary/10 text-xs rounded-full px-1.5 py-0.5">+</span>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default RecommendedFilters;
