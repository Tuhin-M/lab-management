
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, Check } from "lucide-react";

export interface Lab {
  id: string;
  name: string;
  address: string;
  distance: number; // in km
  rating: number;
  reviewCount: number;
  price: number;
  waitTime: string;
  openNow: boolean;
  facilities: string[];
  imageUrl: string;
}

interface LabCardProps {
  lab: Lab;
  onSelect: (lab: Lab) => void;
}

const LabCard = ({ lab, onSelect }: LabCardProps) => {
  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div 
        className="h-48 bg-cover bg-center w-full" 
        style={{ backgroundImage: `url(${lab.imageUrl || '/placeholder.svg'})` }}
      />
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold">{lab.name}</CardTitle>
          <div className="flex items-center bg-primary/10 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
            <span className="text-sm font-medium">{lab.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground ml-1">({lab.reviewCount})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-muted-foreground mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm">{lab.address}</p>
              <p className="text-xs text-muted-foreground">{lab.distance.toFixed(1)} km away</p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-1 ${lab.openNow ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <p className="text-sm">{lab.openNow ? 'Open Now' : 'Closed'} · {lab.waitTime} wait</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {lab.facilities.slice(0, 3).map((facility, i) => (
              <span key={i} className="text-xs bg-secondary px-2 py-1 rounded-full">
                {facility}
              </span>
            ))}
            {lab.facilities.length > 3 && (
              <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                +{lab.facilities.length - 3}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">${lab.price}</p>
          <p className="text-xs text-muted-foreground">Test Fee</p>
        </div>
        <Button onClick={() => onSelect(lab)}>
          <Check className="mr-2 h-4 w-4" />
          Select Lab
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LabCard;
