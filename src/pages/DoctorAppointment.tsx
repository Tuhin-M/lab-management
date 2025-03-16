
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import RecommendedFilters from "@/components/RecommendedFilters";
import DoctorAppointmentHeader from "@/components/doctor/DoctorAppointmentHeader";
import DoctorAppointmentFooter from "@/components/doctor/DoctorAppointmentFooter";
import DoctorFilters from "@/components/doctor/DoctorFilters";
import DoctorCard from "@/components/doctor/DoctorCard";
import { doctors } from "@/data/doctorsData";

const DoctorAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  
  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));
  
  const handleFilterSelect = (filter: string) => {
    setSearchQuery(filter);
  };
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery.trim() === "" || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
    
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
      <DoctorAppointmentHeader />

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
            <DoctorFilters 
              selectedSpecialty={selectedSpecialty}
              setSelectedSpecialty={setSelectedSpecialty}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              specialties={specialties}
            />
          </div>
          
          {/* Right Column - Doctors List */}
          <div className="lg:col-span-3 space-y-6">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No doctors found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery("");
                  setSelectedSpecialty("all");
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredDoctors.map(doctor => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  selectedDoctor={selectedDoctor}
                  selectedDate={selectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                  setSelectedDoctor={setSelectedDoctor}
                  setSelectedDate={setSelectedDate}
                  setSelectedTimeSlot={setSelectedTimeSlot}
                  onBookAppointment={handleBookAppointment}
                />
              ))
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <DoctorAppointmentFooter />
    </div>
  );
};

export default DoctorAppointment;
