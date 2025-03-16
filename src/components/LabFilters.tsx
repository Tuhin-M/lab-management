
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Star, 
  MapPin, 
  BadgeIndianRupee,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

export interface LabFiltersProps {
  onSortChange: (sortOption: string) => void;
  onFilterChange: (filters: LabFiltersState) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export interface LabFiltersState {
  rating: number;
  maxDistance: number;
  openNow: boolean;
  facilities: Record<string, boolean>;
}

const LabFilters = ({ 
  onSortChange, 
  onFilterChange,
  isMobile = false,
  onClose 
}: LabFiltersProps) => {
  const [filters, setFilters] = useState<LabFiltersState>({
    rating: 0,
    maxDistance: 10,
    openNow: false,
    facilities: {
      "Home Collection": false,
      "Digital Reports": false,
      "NABL Accredited": false,
      "Open 24x7": false,
      "Free Home Delivery": false,
      "Insurance Accepted": false,
    },
  });

  const [sortOption, setSortOption] = useState("relevance");
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    rating: true,
    distance: true,
    facilities: true,
  });
  
  const handleSortChange = (value: string) => {
    setSortOption(value);
    onSortChange(value);
  };

  const handleFilterChange = (newFilters: Partial<LabFiltersState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleFacilityChange = (facility: string, checked: boolean) => {
    handleFilterChange({
      facilities: {
        ...filters.facilities,
        [facility]: checked,
      },
    });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const activeFiltersCount = 
    (filters.rating > 0 ? 1 : 0) + 
    (filters.maxDistance < 10 ? 1 : 0) + 
    (filters.openNow ? 1 : 0) + 
    Object.values(filters.facilities).filter(Boolean).length;

  return (
    <div className={`${isMobile ? 'w-full p-4 bg-white' : 'w-full max-w-xs sticky top-20'}`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-4 pb-2 border-b">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <h2 className="font-semibold">Filters</h2>
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-primary text-white">{activeFiltersCount}</Badge>
            )}
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      )}

      {!isMobile && (
        <div className="flex items-center mb-4">
          <Filter className="h-4 w-4 mr-2" />
          <h2 className="font-semibold">Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-primary text-white">{activeFiltersCount}</Badge>
          )}
        </div>
      )}

      <div className="space-y-4">
        {/* Sort Options */}
        <Collapsible open={expandedSections.sort} className="border rounded-md overflow-hidden">
          <CollapsibleTrigger asChild onClick={() => toggleSection("sort")}>
            <div className="flex items-center justify-between p-3 cursor-pointer bg-secondary/50 hover:bg-secondary">
              <div className="flex items-center">
                <h3 className="font-medium text-sm">Sort By</h3>
              </div>
              {expandedSections.sort ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3">
            <RadioGroup value={sortOption} onValueChange={handleSortChange} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="relevance" id="relevance" />
                <label htmlFor="relevance" className="text-sm cursor-pointer">Relevance</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rating" id="rating" />
                <label htmlFor="rating" className="text-sm cursor-pointer flex items-center">
                  Rating <Star className="h-3 w-3 ml-1 text-primary" fill="currentColor" />
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="distance" id="distance" />
                <label htmlFor="distance" className="text-sm cursor-pointer flex items-center">
                  Distance <MapPin className="h-3 w-3 ml-1 text-primary" />
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-low" id="price-low" />
                <label htmlFor="price-low" className="text-sm cursor-pointer flex items-center">
                  Price: Low to High <BadgeIndianRupee className="h-3 w-3 ml-1 text-primary" />
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-high" id="price-high" />
                <label htmlFor="price-high" className="text-sm cursor-pointer flex items-center">
                  Price: High to Low <BadgeIndianRupee className="h-3 w-3 ml-1 text-primary" />
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wait-time" id="wait-time" />
                <label htmlFor="wait-time" className="text-sm cursor-pointer flex items-center">
                  Wait Time <Clock className="h-3 w-3 ml-1 text-primary" />
                </label>
              </div>
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Rating Filter */}
        <Collapsible open={expandedSections.rating} className="border rounded-md overflow-hidden">
          <CollapsibleTrigger asChild onClick={() => toggleSection("rating")}>
            <div className="flex items-center justify-between p-3 cursor-pointer bg-secondary/50 hover:bg-secondary">
              <div className="flex items-center">
                <h3 className="font-medium text-sm">Minimum Rating</h3>
                {filters.rating > 0 && (
                  <Badge className="ml-2 bg-primary text-white">{filters.rating}+</Badge>
                )}
              </div>
              {expandedSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Slider
                  value={[filters.rating]}
                  min={0}
                  max={5}
                  step={0.5}
                  onValueChange={(value) => handleFilterChange({ rating: value[0] })}
                  className="flex-grow"
                />
                <span className="w-10 text-sm font-medium">{filters.rating} ⭐</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Any</span>
                <span className="text-xs">5.0</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Distance Filter */}
        <Collapsible open={expandedSections.distance} className="border rounded-md overflow-hidden">
          <CollapsibleTrigger asChild onClick={() => toggleSection("distance")}>
            <div className="flex items-center justify-between p-3 cursor-pointer bg-secondary/50 hover:bg-secondary">
              <div className="flex items-center">
                <h3 className="font-medium text-sm">Maximum Distance</h3>
                {filters.maxDistance < 10 && (
                  <Badge className="ml-2 bg-primary text-white">{filters.maxDistance} km</Badge>
                )}
              </div>
              {expandedSections.distance ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Slider
                  value={[filters.maxDistance]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => handleFilterChange({ maxDistance: value[0] })}
                  className="flex-grow"
                />
                <span className="w-16 text-sm font-medium">{filters.maxDistance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">1 km</span>
                <span className="text-xs">10 km</span>
              </div>
              <div className="mt-2">
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id="open-now"
                    checked={filters.openNow}
                    onCheckedChange={(checked) => handleFilterChange({ openNow: checked as boolean })}
                  />
                  <label
                    htmlFor="open-now"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Open Now
                  </label>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Facilities */}
        <Collapsible open={expandedSections.facilities} className="border rounded-md overflow-hidden">
          <CollapsibleTrigger asChild onClick={() => toggleSection("facilities")}>
            <div className="flex items-center justify-between p-3 cursor-pointer bg-secondary/50 hover:bg-secondary">
              <div className="flex items-center">
                <h3 className="font-medium text-sm">Facilities</h3>
                {Object.values(filters.facilities).filter(Boolean).length > 0 && (
                  <Badge className="ml-2 bg-primary text-white">
                    {Object.values(filters.facilities).filter(Boolean).length}
                  </Badge>
                )}
              </div>
              {expandedSections.facilities ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3">
            <div className="space-y-2">
              {Object.keys(filters.facilities).map((facility) => (
                <div key={facility} className="flex items-center space-x-2">
                  <Checkbox
                    id={facility}
                    checked={filters.facilities[facility]}
                    onCheckedChange={(checked) => handleFacilityChange(facility, checked as boolean)}
                  />
                  <label
                    htmlFor={facility}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {facility}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button
          variant="outline"
          className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-white"
          onClick={() => {
            const resetFilters = {
              rating: 0,
              maxDistance: 10,
              openNow: false,
              facilities: Object.keys(filters.facilities).reduce(
                (acc, facility) => ({ ...acc, [facility]: false }),
                {} as Record<string, boolean>
              ),
            };
            setFilters(resetFilters);
            onFilterChange(resetFilters);
          }}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};

export default LabFilters;
