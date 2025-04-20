
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { timeSlots } from "@/data/doctorsData";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AppointmentBookingProps {
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: React.Dispatch<React.SetStateAction<string | null>>;
  onCancel: () => void;
  onConfirm: () => void;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="w-full border rounded-md p-3">
      <div className="mb-3">
        <h3 className="font-medium mb-2">Select date and time</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal flex-grow",
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
      </div>
      
      {selectedDate && (
        <div>
          <h3 className="font-medium mb-2">Available time slots</h3>
          <ScrollArea className="h-24">
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedTimeSlot === slot ? "default" : "outline"}
                  size="sm"
                  className={selectedTimeSlot === slot ? "bg-primary text-white" : ""}
                  onClick={() => setSelectedTimeSlot(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline" 
          className="flex-grow"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          className="flex-grow bg-primary hover:bg-primary/90"
          onClick={onConfirm}
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );
};

export default AppointmentBooking;
