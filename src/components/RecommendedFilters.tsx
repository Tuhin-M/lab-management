
import React from "react";
import { Badge } from "@/components/ui/badge";

interface RecommendedFiltersProps {
  onFilterSelect: (filter: string) => void;
}

const RecommendedFilters = ({ onFilterSelect }: RecommendedFiltersProps) => {
  const recommendedFilters = [
    "Complete Blood Count",
    "Thyroid Profile",
    "Diabetes",
    "Lipid Profile",
    "Liver Function",
    "Vitamin Tests",
    "Hormone Tests"
  ];

  return (
    <div className="w-full mb-6">
      <h3 className="text-sm font-medium mb-2 text-muted-foreground">Recommended Searches:</h3>
      <div className="flex flex-wrap gap-2">
        {recommendedFilters.map((filter) => (
          <Badge 
            key={filter}
            variant="outline" 
            className="px-3 py-1 bg-white cursor-pointer hover:bg-primary hover:text-white border-primary/30 text-primary"
            onClick={() => onFilterSelect(filter)}
          >
            {filter}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default RecommendedFilters;
