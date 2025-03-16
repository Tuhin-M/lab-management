
import React, { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowUpDown, 
  Filter, 
  Star, 
  Clock, 
  DollarSign,
  MapPin
} from "lucide-react";

export interface LabFiltersProps {
  onSortChange: (sortOption: string) => void;
  onFilterChange: (filters: LabFiltersState) => void;
}

export interface LabFiltersState {
  rating: number;
  maxDistance: number;
  openNow: boolean;
  facilities: Record<string, boolean>;
}

const LabFilters = ({ onSortChange, onFilterChange }: LabFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<LabFiltersState>({
    rating: 0,
    maxDistance: 10,
    openNow: false,
    facilities: {
      "Home Collection": false,
      "Digital Reports": false,
      "Insurance Accepted": false,
      "24/7 Service": false,
    },
  });

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

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>

        <div className="flex-grow flex justify-end">
          <Select onValueChange={onSortChange} defaultValue="relevance">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">
                <div className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Relevance
                </div>
              </SelectItem>
              <SelectItem value="rating">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  Rating
                </div>
              </SelectItem>
              <SelectItem value="distance">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Distance
                </div>
              </SelectItem>
              <SelectItem value="price-low">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Price: Low to High
                </div>
              </SelectItem>
              <SelectItem value="price-high">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Price: High to Low
                </div>
              </SelectItem>
              <SelectItem value="wait-time">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Wait Time
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isOpen && (
        <div className="bg-card rounded-lg shadow-sm border p-4 space-y-6 mt-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Minimum Rating</h3>
              <div className="flex items-center space-x-2">
                <Slider
                  value={[filters.rating]}
                  min={0}
                  max={5}
                  step={0.5}
                  onValueChange={(value) => handleFilterChange({ rating: value[0] })}
                  className="flex-grow"
                />
                <span className="w-12 text-sm font-medium">{filters.rating} ⭐</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Maximum Distance (km)</h3>
              <div className="flex items-center space-x-2">
                <Slider
                  value={[filters.maxDistance]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(value) => handleFilterChange({ maxDistance: value[0] })}
                  className="flex-grow"
                />
                <span className="w-12 text-sm font-medium">{filters.maxDistance} km</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="open-now"
                checked={filters.openNow}
                onCheckedChange={(checked) => handleFilterChange({ openNow: checked as boolean })}
              />
              <label
                htmlFor="open-now"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Open Now
              </label>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Facilities</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(filters.facilities).map((facility) => (
                  <div key={facility} className="flex items-center space-x-2">
                    <Checkbox
                      id={facility}
                      checked={filters.facilities[facility]}
                      onCheckedChange={(checked) => handleFacilityChange(facility, checked as boolean)}
                    />
                    <label
                      htmlFor={facility}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {facility}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                const resetFilters = {
                  rating: 0,
                  maxDistance: 10,
                  openNow: false,
                  facilities: Object.keys(filters.facilities).reduce(
                    (acc, facility) => ({ ...acc, [facility]: false }),
                    {}
                  ),
                };
                setFilters(resetFilters);
                onFilterChange(resetFilters);
              }}
              size="sm"
            >
              Reset
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              size="sm"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabFilters;
