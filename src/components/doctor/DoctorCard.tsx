
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, CalendarIcon, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AppointmentBooking from "./AppointmentBooking";
import { Doctor } from "@/data/doctorsData";

interface DoctorCardProps {
  doctor: Doctor;
  selectedDoctor: string | null;
  selectedDate: Date | undefined;
  selectedTimeSlot: string | null;
  setSelectedDoctor: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setSelectedTimeSlot: React.Dispatch<React.SetStateAction<string | null>>;
  onBookAppointment: (doctorId: string) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  selectedDoctor,
  selectedDate,
  selectedTimeSlot,
  setSelectedDoctor,
  setSelectedDate,
  setSelectedTimeSlot,
  onBookAppointment,
}) => {
  const isSelected = selectedDoctor === doctor.id;

  return (
    <Card key={doctor.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div 
            className="w-full md:w-1/4 h-48 md:h-auto bg-cover bg-center" 
            style={{ backgroundImage: `url(${doctor.imageUrl})` }}
          />
          <div className="p-6 flex-grow">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{doctor.name}</h2>
                <p className="text-primary">{doctor.specialty}</p>
                <p className="text-sm text-muted-foreground">{doctor.qualifications}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                  <span className="text-sm">{doctor.rating}</span>
                  <span className="text-xs text-muted-foreground ml-1">({doctor.reviewCount} reviews)</span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 md:text-right">
                <p className="text-lg font-bold">₹{doctor.fee}</p>
                <p className="text-xs text-muted-foreground">Consultation Fee</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                <p className="text-sm">{doctor.hospital}, {doctor.location}</p>
                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full ml-2">
                  {doctor.distance} km
                </span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                <p className="text-sm">Experience: {doctor.experience} years</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {doctor.availableToday ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Available Today
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Next Available: Tomorrow
                </Badge>
              )}
              <Badge variant="outline" className="bg-secondary/50">
                <Clock className="h-3 w-3 mr-1" /> Next slot in 2 hours
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              {isSelected ? (
                <AppointmentBooking
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                  setSelectedTimeSlot={setSelectedTimeSlot}
                  onCancel={() => setSelectedDoctor(null)}
                  onConfirm={() => onBookAppointment(doctor.id)}
                />
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white flex-grow"
                  >
                    View Profile
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90 flex-grow"
                    onClick={() => setSelectedDoctor(doctor.id)}
                  >
                    Book Appointment
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
