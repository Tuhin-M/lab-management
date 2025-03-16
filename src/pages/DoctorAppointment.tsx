
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar as CalendarIcon,
  Search,
  Star,
  MapPin,
  Calendar,
  Clock,
  Filter,
  ArrowLeft,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import RecommendedFilters from "@/components/RecommendedFilters";

// Mock data for doctors
const doctors = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    specialty: "Cardiologist",
    experience: 15,
    rating: 4.8,
    reviewCount: 124,
    location: "Koramangala, Bengaluru",
    distance: 1.5,
    availableToday: true,
    fee: 1200,
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    qualifications: "MBBS, MD (Cardiology), DNB",
    hospital: "Manipal Hospital",
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    specialty: "Orthopedic Surgeon",
    experience: 12,
    rating: 4.6,
    reviewCount: 98,
    location: "Indiranagar, Bengaluru",
    distance: 2.3,
    availableToday: true,
    fee: 1000,
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2064&auto=format&fit=crop",
    qualifications: "MBBS, MS (Ortho), DNB",
    hospital: "Apollo Hospital",
  },
  {
    id: "3",
    name: "Dr. Ananya Patel",
    specialty: "Dermatologist",
    experience: 8,
    rating: 4.9,
    reviewCount: 156,
    location: "HSR Layout, Bengaluru",
    distance: 3.1,
    availableToday: false,
    fee: 1500,
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2187&auto=format&fit=crop",
    qualifications: "MBBS, MD (Dermatology)",
    hospital: "Fortis Hospital",
  },
  {
    id: "4",
    name: "Dr. Vikram Singh",
    specialty: "Neurologist",
    experience: 20,
    rating: 4.7,
    reviewCount: 210,
    location: "Whitefield, Bengaluru",
    distance: 5.7,
    availableToday: true,
    fee: 2000,
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    qualifications: "MBBS, MD (Neurology), DM",
    hospital: "Columbia Asia Hospital",
  },
  {
    id: "5",
    name: "Dr. Meera Iyer",
    specialty: "Gynecologist",
    experience: 14,
    rating: 4.8,
    reviewCount: 178,
    location: "Jayanagar, Bengaluru",
    distance: 4.2,
    availableToday: true,
    fee: 1300,
    imageUrl: "https://images.unsplash.com/photo-1651008376679-8b8a481cc391?q=80&w=1974&auto=format&fit=crop",
    qualifications: "MBBS, MD (Gynecology)",
    hospital: "Cloudnine Hospital",
  },
];

// Available time slots
const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM",
];

const DoctorAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  
  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));
  
  const handleFilterSelect = (filter: string) => {
    setSearchQuery(filter);
  };
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery.trim() === "" || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSpecialty = selectedSpecialty === "" || doctor.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });
  
  const handleBookAppointment = (doctorId: string) => {
    if (!selectedDate) {
      toast({
        title: "Please select a date",
        description: "You need to select a date for your appointment",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedTimeSlot) {
      toast({
        title: "Please select a time slot",
        description: "You need to select a time slot for your appointment",
        variant: "destructive",
      });
      return;
    }
    
    const doctor = doctors.find(d => d.id === doctorId);
    
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${doctor?.name} is scheduled for ${format(selectedDate, "PPP")} at ${selectedTimeSlot}`,
    });
    
    setSelectedDoctor(null);
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Ekitsa</h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button>Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Find Doctors & Book Appointments</h1>
        </div>
        
        <div className="w-full mx-auto mb-8">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by doctor name, specialty, or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-24 h-12 rounded-lg text-base border-primary/20 focus-visible:ring-primary"
            />
            <Button 
              className="absolute right-0 h-12 rounded-l-none bg-primary hover:bg-primary/90"
            >
              <Search className="mr-2" />
              Search
            </Button>
          </div>
        </div>
        
        <RecommendedFilters onFilterSelect={handleFilterSelect} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Filters */}
          <div className="space-y-6">
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
                        <SelectItem value="">All Specialties</SelectItem>
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
                  
                  <Button variant="outline" className="w-full">
                    Clear All Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Doctors List */}
          <div className="lg:col-span-3 space-y-6">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No doctors found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery("");
                  setSelectedSpecialty("");
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredDoctors.map(doctor => (
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
                            <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
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
                          {selectedDoctor === doctor.id ? (
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
                                  onClick={() => setSelectedDoctor(null)}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  className="flex-grow bg-primary hover:bg-primary/90"
                                  onClick={() => handleBookAppointment(doctor.id)}
                                >
                                  Confirm Booking
                                </Button>
                              </div>
                            </div>
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
              ))
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto py-6 px-4 md:flex justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © 2023 Ekitsa. All rights reserved.
            </p>
          </div>
          <div className="flex justify-center md:justify-end space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DoctorAppointment;
