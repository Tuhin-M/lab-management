
import React from "react";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Filter } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <h3 className="font-medium flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </h3>
          
          <div>
            <p className="text-sm mb-2">Specialty</p>
            <Select 
              value={selectedSpecialty} 
              onValueChange={setSelectedSpecialty}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <p className="text-sm mb-2">Appointment Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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
          
          <div>
            <p className="text-sm mb-2">Availability</p>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
              >
                <span className="bg-primary h-2 w-2 rounded-full mr-2"></span>
                Available Today
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
              >
                <span className="bg-primary h-2 w-2 rounded-full mr-2"></span>
                Available Tomorrow
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
              >
                <span className="bg-primary h-2 w-2 rounded-full mr-2"></span>
                Available This Weekend
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm mb-2">Price Range</p>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm">₹500-₹1000</Button>
              <Button variant="outline" size="sm">₹1000-₹2000</Button>
              <Button variant="outline" size="sm">₹2000+</Button>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setSelectedSpecialty("all");
              setSelectedDate(undefined);
            }}
          >
            Clear All Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorFilters;
