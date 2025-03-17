
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface CitySelectionProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  className?: string;
}

const CitySelection = ({
  selectedCity,
  onCityChange,
  className = "",
}: CitySelectionProps) => {
  const cities = [
    "Bengaluru",
    "Mumbai",
    "Delhi",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Chandigarh",
  ];

  return (
    <div className={`w-full ${className}`}>
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="bg-white h-12 border-primary/20 focus:ring-primary w-full md:w-[180px]">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <SelectValue placeholder="Select city" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelection;
