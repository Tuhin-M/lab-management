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
    'Bangalore',
    'Chennai',
    'Kolkata'
  ];

  return (
    <div className={className}>
      <label className="block mb-2 font-medium">City</label>
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-full" />
        <SelectContent>
          {cities.map(city => (
            <SelectItem key={city} value={city}>
              <MapPin className="inline-block mr-2" />
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelection;
