
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Filter, Sparkles, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface DoctorFiltersProps {
  selectedSpecialty: string;
  setSelectedSpecialty: React.Dispatch<React.SetStateAction<string>>;
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  specialties: string[];
}

const DoctorFilters: React.FC<DoctorFiltersProps> = ({
  selectedSpecialty,
  setSelectedSpecialty,
  selectedDate,
  setSelectedDate,
  specialties,
}) => {
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const availabilityOptions = [
    { id: "today", label: "Available Today", color: "bg-green-500" },
    { id: "tomorrow", label: "Available Tomorrow", color: "bg-blue-500" },
    { id: "weekend", label: "Available This Weekend", color: "bg-purple-500" },
  ];

  const priceRanges = [
    { id: "low", label: "₹500-₹1000", range: "Budget" },
    { id: "mid", label: "₹1000-₹2000", range: "Standard" },
    { id: "high", label: "₹2000+", range: "Premium" },
  ];

  return (
    <Card className="bg-white/90 backdrop-blur-md border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden sticky top-24">
      <CardHeader className="pb-2 pt-5 px-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Filter className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-bold text-lg">Filters</h3>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        {/* Specialty */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Specialty
          </label>
          <Select 
            value={selectedSpecialty} 
            onValueChange={setSelectedSpecialty}
          >
            <SelectTrigger className="w-full rounded-xl border-gray-200 bg-slate-50/50 hover:bg-slate-100/80 transition-colors h-11">
              <SelectValue placeholder="All Specialties" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">All Specialties</SelectItem>
              {specialties.map(specialty => (
                <SelectItem key={specialty} value={specialty} className="rounded-lg">
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Appointment Date */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            Appointment Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal rounded-xl border-gray-200 bg-slate-50/50 hover:bg-slate-100/80 h-11",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                disabled={(date) => date < new Date()}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Availability */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Availability
          </label>
          <div className="space-y-2">
            {availabilityOptions.map((option) => (
              <button 
                key={option.id}
                onClick={() => setSelectedAvailability(selectedAvailability === option.id ? null : option.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
                  selectedAvailability === option.id 
                    ? "bg-primary/5 border-primary text-primary shadow-sm" 
                    : "bg-slate-50/50 border-gray-200 hover:bg-slate-100/80 hover:border-gray-300"
                )}
              >
                <span className={cn("h-2.5 w-2.5 rounded-full", option.color)}></span>
                <span className="text-sm font-medium">{option.label}</span>
                {selectedAvailability === option.id && (
                  <CheckCircle2 className="h-4 w-4 ml-auto text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <Separator className="bg-gray-100" />
        
        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Price Range
          </label>
          <div className="grid grid-cols-3 gap-2">
            {priceRanges.map((price) => (
              <button
                key={price.id}
                onClick={() => setSelectedPrice(selectedPrice === price.id ? null : price.id)}
                className={cn(
                  "flex flex-col items-center p-3 rounded-xl border transition-all duration-200",
                  selectedPrice === price.id 
                    ? "bg-primary/10 border-primary text-primary shadow-sm" 
                    : "bg-slate-50/50 border-gray-200 hover:bg-slate-100/80"
                )}
              >
                <span className="text-xs font-bold">{price.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Clear Filters Button */}
        <Button 
          variant="outline" 
          className="w-full rounded-xl border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          onClick={() => {
            setSelectedSpecialty("all");
            setSelectedDate(undefined);
            setSelectedAvailability(null);
            setSelectedPrice(null);
          }}
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default DoctorFilters;
