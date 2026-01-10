
import React, { useState, useEffect } from "react";
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
  Filter,
  RotateCcw
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface LabFiltersProps {
  onSortChange: (sortOption: string) => void;
  onFilterChange: (filters: LabFiltersState) => void;
  initialFilters?: LabFiltersState;
  initialSortOption?: string;
  isMobile?: boolean;
  onClose?: () => void;
  onReset?: () => void;
  isExternalFilterActive?: boolean;
}

export interface LabFiltersState {
  rating: number;
  maxDistance: number;
  openNow: boolean;
  facilities: Record<string, boolean>;
}

const defaultFilters: LabFiltersState = {
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
};

const LabFilters = ({ 
  onSortChange, 
  onFilterChange,
  initialFilters,
  initialSortOption = "relevance",
  isMobile = false,
  onClose,
  onReset,
  isExternalFilterActive = false
}: LabFiltersProps) => {
  const [filters, setFilters] = useState<LabFiltersState>(initialFilters || defaultFilters);
  const [sortOption, setSortOption] = useState(initialSortOption);
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    rating: true,
    distance: true,
    facilities: true,
  });

  // Sync with parent's initial values when they change
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  useEffect(() => {
    setSortOption(initialSortOption);
  }, [initialSortOption]);
  
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

  const showResetButton = activeFiltersCount > 0 || isExternalFilterActive;

  return (
    <div className={`${isMobile ? 'w-full p-6 bg-background' : 'w-full max-w-xs sticky top-32'}`}>
      {!isMobile && (
        <div className="flex items-center justify-between mb-6 px-1">
           <div className="flex items-center gap-3">
             <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
               <Filter className="h-5 w-5" />
             </div>
             <div>
               <h2 className="font-bold text-lg leading-none">Filters</h2>
               {activeFiltersCount > 0 && (
                 <p className="text-xs text-muted-foreground mt-1">{activeFiltersCount} active</p>
               )}
             </div>
           </div>
           {showResetButton && (
             <Button 
               variant="ghost" 
               size="sm" 
               className="h-8 px-2 text-xs hover:bg-destructive/10 hover:text-destructive transition-colors rounded-lg"
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
                 setSortOption("relevance");
                 onFilterChange(resetFilters);
                 onSortChange("relevance");
                 onReset?.();
               }}
             >
               Clear all
             </Button>
           )}
        </div>
      )}

      <div className="space-y-5">
        {/* Sort Options */}
        <div className="bg-card/40 backdrop-blur-sm rounded-2xl border border-white/10 shadow-sm overflow-hidden group hover:bg-card/60 transition-colors">
        <Collapsible open={expandedSections.sort} className="">
          <CollapsibleTrigger asChild onClick={() => toggleSection("sort")}>
            <div className="flex items-center justify-between p-4 cursor-pointer">
              <span className="font-semibold text-sm">Sort By</span>
              {expandedSections.sort ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <RadioGroup value={sortOption} onValueChange={handleSortChange} className="space-y-3">
              {[
                { id: "relevance", label: "Relevance", icon: null },
                { id: "rating", label: "Rating", icon: <Star className="h-3.5 w-3.5 ml-1.5 text-yellow-500 fill-yellow-500" /> },
                { id: "distance", label: "Distance", icon: <MapPin className="h-3.5 w-3.5 ml-1.5 text-blue-500" /> },
                { id: "price-low", label: "Price: Low to High", icon: <BadgeIndianRupee className="h-3.5 w-3.5 ml-1.5 text-green-600" /> },
                { id: "price-high", label: "Price: High to Low", icon: <BadgeIndianRupee className="h-3.5 w-3.5 ml-1.5 text-green-600" /> },
                { id: "wait-time", label: "Wait Time", icon: <Clock className="h-3.5 w-3.5 ml-1.5 text-orange-500" /> },
              ].map((opt) => (
                <div key={opt.id} className="flex items-center justify-between group/item cursor-pointer p-2 rounded-lg hover:bg-primary/5 transition-colors">
                  <label htmlFor={opt.id} className="text-sm cursor-pointer flex items-center flex-1 text-muted-foreground group-hover/item:text-foreground">
                    {opt.label} {opt.icon}
                  </label>
                  <RadioGroupItem value={opt.id} id={opt.id} className="scale-90 border-muted-foreground/30 data-[state=checked]:border-primary" />
                </div>
              ))}
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>
        </div>

        {/* Rating Filter */}
        <div className="bg-card/40 backdrop-blur-sm rounded-2xl border border-white/10 shadow-sm overflow-hidden group hover:bg-card/60 transition-colors">
        <Collapsible open={expandedSections.rating} className="">
          <CollapsibleTrigger asChild onClick={() => toggleSection("rating")}>
            <div className="flex items-center justify-between p-4 cursor-pointer">
              <div className="flex items-center">
                <span className="font-semibold text-sm">Minimum Rating</span>
                {filters.rating > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px] bg-yellow-500/10 text-yellow-600 border-yellow-200">{filters.rating}+</Badge>
                )}
              </div>
              {expandedSections.rating ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-6 pt-2">
              <Slider
                value={[filters.rating]}
                min={0}
                max={5}
                step={0.5}
                onValueChange={(value) => handleFilterChange({ rating: value[0] })}
                className="py-2"
              />
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="text-xs font-medium">Any</span>
                <span className="text-sm font-bold text-foreground bg-secondary px-2 py-0.5 rounded-md">{filters.rating} Stars</span>
                <span className="text-xs font-medium">5.0</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        </div>

        {/* Distance Filter */}
        <div className="bg-card/40 backdrop-blur-sm rounded-2xl border border-white/10 shadow-sm overflow-hidden group hover:bg-card/60 transition-colors">
        <Collapsible open={expandedSections.distance} className="">
          <CollapsibleTrigger asChild onClick={() => toggleSection("distance")}>
            <div className="flex items-center justify-between p-4 cursor-pointer">
              <div className="flex items-center">
                <span className="font-semibold text-sm">Distance</span>
                {filters.maxDistance < 10 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px] bg-blue-500/10 text-blue-600 border-blue-200">{filters.maxDistance} km</Badge>
                )}
              </div>
              {expandedSections.distance ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-6 pt-2">
              <Slider
                value={[filters.maxDistance]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => handleFilterChange({ maxDistance: value[0] })}
                className="py-2"
              />
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="text-xs font-medium">1 km</span>
                <span className="text-sm font-bold text-foreground bg-secondary px-2 py-0.5 rounded-md">{filters.maxDistance} km</span>
                <span className="text-xs font-medium">10 km</span>
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                  <Checkbox
                    id="open-now"
                    checked={filters.openNow}
                    onCheckedChange={(checked) => handleFilterChange({ openNow: checked as boolean })}
                  />
                  <label
                    htmlFor="open-now"
                    className="text-sm font-medium leading-none cursor-pointer flex items-center flex-1"
                  >
                    Open Now <span className="ml-auto inline-block h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]"></span>
                  </label>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        </div>

        {/* Facilities */}
        <div className="bg-card/40 backdrop-blur-sm rounded-2xl border border-white/10 shadow-sm overflow-hidden group hover:bg-card/60 transition-colors">
        <Collapsible open={expandedSections.facilities} className="">
          <CollapsibleTrigger asChild onClick={() => toggleSection("facilities")}>
            <div className="flex items-center justify-between p-4 cursor-pointer">
              <div className="flex items-center">
                <span className="font-semibold text-sm">Facilities</span>
                {Object.values(filters.facilities).filter(Boolean).length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px] bg-purple-500/10 text-purple-600 border-purple-200">
                    {Object.values(filters.facilities).filter(Boolean).length}
                  </Badge>
                )}
              </div>
              {expandedSections.facilities ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-1 pt-1">
              {Object.keys(filters.facilities).map((facility) => (
                <div key={facility} className="flex items-center space-x-3 group/item p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                  <Checkbox
                    id={facility}
                    checked={filters.facilities[facility]}
                    onCheckedChange={(checked) => handleFacilityChange(facility, checked as boolean)}
                    className="data-[state=checked]:bg-primary"
                  />
                  <label
                    htmlFor={facility}
                    className="text-sm leading-none cursor-pointer flex-1 text-muted-foreground group-hover/item:text-foreground transition-colors"
                  >
                    {facility}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default LabFilters;
