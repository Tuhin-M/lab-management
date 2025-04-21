import React from "react";
import { MapPin } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

interface CitySelectionProps {
  selectedCity: string;
  onCityChange: (value: string) => void;
  className?: string;
}

const CitySelection: React.FC<CitySelectionProps> = ({
  selectedCity,
  onCityChange,
  className = '',
}) => {
  const cities = [
    'Mumbai',
    'Delhi',
    'Bengaluru',
    'Chennai',
    'Kolkata'
  ];

  return (
    <div className={className}>
      <label className="block mb-2 text-base font-semibold text-primary">Select your city</label>
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-full flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm bg-white text-base focus:ring-2 focus:ring-primary">
          <MapPin className="inline-block mr-2 text-primary" />
          <span>{selectedCity}</span>
        </SelectTrigger>
        <SelectContent>
          {cities.map(city => (
            <SelectItem key={city} value={city}>
              <MapPin className="inline-block mr-2 text-primary" />
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelection;
