import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from "@/lib/utils";
import { labsAPI } from "@/services/api";

interface CitySelectionProps {
  selectedCity: string;
  onCityChange: (value: string) => void;
  className?: string;
  availableCities?: string[];
}

const CitySelection: React.FC<CitySelectionProps> = ({
  selectedCity,
  onCityChange,
  className = '',
  availableCities: propAvailableCities,
}) => {
  const [fetchedCities, setFetchedCities] = useState<string[]>([]);

  useEffect(() => {
    if (propAvailableCities !== undefined) return;

    let isMounted = true;
    labsAPI.getAvailableLocations()
      .then((res) => {
        if (isMounted && res.cities) {
          setFetchedCities(res.cities);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch available cities:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [propAvailableCities]);

  const activeCities = propAvailableCities !== undefined ? propAvailableCities : fetchedCities;
  const uniqueCities = new Set(['All Locations', ...activeCities]);
  if (selectedCity && selectedCity !== 'All Locations') {
    uniqueCities.add(selectedCity);
  }
  const cities = Array.from(uniqueCities);

  const displayValue = selectedCity || 'All Locations';

  return (
    <div className={className}>
      <Select value={displayValue} onValueChange={onCityChange}>
        <SelectTrigger 
          className={cn(
            "w-full flex items-center gap-2 h-14 rounded-2xl border-0 shadow-none bg-transparent hover:bg-white/5 data-[state=open]:bg-white/10 text-base md:text-lg font-medium transition-all focus:ring-0 focus:ring-offset-0 px-4",
            className
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="flex-1 text-left truncate">{displayValue}</span>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {cities.map(city => (
            <SelectItem key={city} value={city} className="cursor-pointer py-3 text-base">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {city}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelection;
