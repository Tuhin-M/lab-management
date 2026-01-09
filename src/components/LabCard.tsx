
import React from "react";
import { MapPin, Clock, Star, Check, BadgePercent, Award } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Lab {
  id: string;
  name: string;
  address: string;
  distance: number; // in km
  rating: number;
  reviewCount: number;
  price: number;
  discount?: number;
  waitTime: string;
  openNow: boolean;
  facilities: string[];
  imageUrl: string;
  accreditation?: string;
  yearEstablished?: number;
}

interface LabCardProps {
  lab: Lab;
  onSelect: (lab: Lab) => void;
}

const LabCard = ({ lab, onSelect }: LabCardProps) => {
  const discountedPrice = lab.discount 
    ? Math.round(lab.price - (lab.price * lab.discount / 100)) 
    : lab.price;

  return (
    <Card className="h-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-border/40 bg-white/90 dark:bg-card/90 backdrop-blur-md group shadow-sm">
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
          style={{ backgroundImage: `url(${lab.imageUrl || '/placeholder.svg'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-95" />
        
        <div className="absolute top-3 right-3 flex flex-col gap-2">
           <div className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white border border-white/20 shadow-lg">
             <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1.5" />
             <span className="text-sm font-bold">{lab.rating.toFixed(1)}</span>
             <span className="text-xs text-white/70 ml-1">({lab.reviewCount})</span>
           </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <CardTitle className="text-xl font-bold mb-1 leading-tight">{lab.name}</CardTitle>
          {lab.accreditation && (
            <div className="flex items-center text-white/80 text-xs">
              <Award className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span>{lab.accreditation}</span>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-primary mt-0.5 mr-2.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">{lab.address}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{lab.distance.toFixed(1)} km away</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-primary mr-2.5 flex-shrink-0" />
            <div className="flex items-center text-sm">
              <span className={`w-2 h-2 rounded-full mr-2 ${lab.openNow ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></span>
              <span className="font-medium">{lab.openNow ? 'Open Now' : 'Closed'}</span>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-muted-foreground">{lab.waitTime} wait</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {lab.facilities.slice(0, 3).map((facility, i) => (
              <span key={i} className="text-[10px] font-medium bg-primary/5 text-primary px-2.5 py-1 rounded-full border border-primary/10">
                {facility}
              </span>
            ))}
            {lab.facilities.length > 3 && (
              <span className="text-[10px] font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                +{lab.facilities.length - 3}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <div className="px-5 pb-5 mt-auto">
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Test Fee</p>
            {lab.discount ? (
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-xl text-primary">₹{discountedPrice}</span>
                <span className="text-xs line-through text-muted-foreground decoration-red-500/50">₹{lab.price}</span>
              </div>
            ) : (
              <span className="font-bold text-xl">₹{lab.price}</span>
            )}
          </div>
          <Button onClick={() => onSelect(lab)} className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
            Select Lab
            <Check className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LabCard;
