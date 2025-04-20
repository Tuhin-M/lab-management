
import React, { useState } from "react";
import { Star, MapPin, CalendarIcon, Clock, Heart, Video, Phone, Award, ThumbsUp, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AppointmentBooking from "./AppointmentBooking";
import { Doctor } from "@/data/doctorsData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [favorite, setFavorite] = useState(false);
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'video' | 'phone'>('in-person');
  const { toast } = useToast();

  const handleFavorite = () => {
    setFavorite(!favorite);
    toast({
      title: !favorite ? "Added to favorites" : "Removed from favorites",
      description: !favorite ? `${doctor.name} has been added to your favorites` : `${doctor.name} has been removed from your favorites`,
    });
  };

  return (
    <Card key={doctor.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/4 h-48 md:h-auto">
            <div
              className="w-full h-full bg-cover bg-center" 
              style={{ backgroundImage: `url(${doctor.imageUrl})` }}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className={`absolute top-2 right-2 rounded-full ${favorite ? 'text-red-500' : 'text-gray-400'}`}
              onClick={handleFavorite}
            >
              <Heart className={`h-5 w-5 ${favorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
          <div className="p-6 flex-grow">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold">{doctor.name}</h2>
                  {doctor.verified && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <Award className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Credentials verified by Ekitsa</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <p className="text-primary">{doctor.specialty}</p>
                <p className="text-sm text-muted-foreground">{doctor.qualifications}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                  <span className="text-sm">{doctor.rating}</span>
                  <span className="text-xs text-muted-foreground ml-1">({doctor.reviewCount} reviews)</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center ml-3 text-green-600 cursor-pointer">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span className="text-xs">{Math.round(doctor.reviewCount * 0.92)}% recommend</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">92% of patients recommend this doctor</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 md:text-right">
                <p className="text-lg font-bold">₹{doctor.fee}</p>
                <p className="text-xs text-muted-foreground">Consultation Fee</p>
                {doctor.discountedFee && (
                  <div className="mt-1">
                    <span className="text-xs line-through text-muted-foreground">₹{doctor.discountedFee}</span>
                    <Badge className="ml-2 bg-green-100 text-green-800 border-green-200 text-xs">
                      {Math.round(((doctor.discountedFee - doctor.fee) / doctor.discountedFee) * 100)}% off
                    </Badge>
                  </div>
                )}
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
              {doctor.languages && (
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mr-2" />
                  <p className="text-sm">Languages: {doctor.languages.join(", ")}</p>
                </div>
              )}
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
              {doctor.consultationOptions && doctor.consultationOptions.includes('video') && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  <Video className="h-3 w-3 mr-1" /> Video Consult
                </Badge>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              {isSelected ? (
                <>
                  <div className="w-full mb-3">
                    <h3 className="font-medium mb-2 text-sm">Consultation Type</h3>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={appointmentType === 'in-person' ? 'default' : 'outline'}
                        className={appointmentType === 'in-person' ? 'bg-primary text-white' : ''}
                        onClick={() => setAppointmentType('in-person')}
                      >
                        In-person
                      </Button>
                      {doctor.consultationOptions && doctor.consultationOptions.includes('video') && (
                        <Button 
                          size="sm" 
                          variant={appointmentType === 'video' ? 'default' : 'outline'}
                          className={appointmentType === 'video' ? 'bg-primary text-white' : ''}
                          onClick={() => setAppointmentType('video')}
                        >
                          <Video className="h-4 w-4 mr-1" /> Video
                        </Button>
                      )}
                      {doctor.consultationOptions && doctor.consultationOptions.includes('phone') && (
                        <Button 
                          size="sm" 
                          variant={appointmentType === 'phone' ? 'default' : 'outline'}
                          className={appointmentType === 'phone' ? 'bg-primary text-white' : ''}
                          onClick={() => setAppointmentType('phone')}
                        >
                          <Phone className="h-4 w-4 mr-1" /> Phone
                        </Button>
                      )}
                    </div>
                  </div>
                  <AppointmentBooking
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                    setSelectedTimeSlot={setSelectedTimeSlot}
                    onCancel={() => setSelectedDoctor(null)}
                    onConfirm={() => onBookAppointment(doctor.id)}
                  />
                </>
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
