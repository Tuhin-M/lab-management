
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Filter, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import RecommendedFilters from "@/components/RecommendedFilters";
import DoctorAppointmentHeader from "@/components/doctor/DoctorAppointmentHeader";
import DoctorAppointmentFooter from "@/components/doctor/DoctorAppointmentFooter";
import DoctorFilters from "@/components/doctor/DoctorFilters";
import DoctorCard from "@/components/doctor/DoctorCard";
import { doctors } from "@/data/doctorsData";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SearchBar from "@/components/SearchBar";

const DoctorAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [location, setLocation] = useState("Mumbai, Maharashtra");
  
  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));
  
  const handleFilterSelect = (filter: string) => {
    if (specialties.includes(filter)) {
      setSelectedSpecialty(filter);
    } else {
      setSearchQuery(filter);
    }
  };
  
  const handleCombinedFilterSelect = (filter: string) => {
    toast({
      title: "Filter applied",
      description: `Added "${filter}" to your search`,
    });
  };
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery.trim() === "" || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
      
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
        
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <Button variant="outline" className="text-sm">
            {location} <span className="text-primary ml-1">Change</span>
          </Button>
        </div>
        
        {/* Search Bar with reduced width */}
        <div className="mb-8">
          <SearchBar 
            onSearch={(query) => setSearchQuery(query)} 
            maxWidth="max-w-2xl"
          />
        </div>
        
        {/* Quick Filters */}
        <div className="mb-6">
          <RecommendedFilters 
            onFilterSelect={handleFilterSelect} 
            title="Quick Filters:"
            recommendedFilters={specialties}
          />
        </div>
        
        {/* Combined Filters */}
        <div className="mb-6">
          <RecommendedFilters 
            onFilterSelect={handleCombinedFilterSelect} 
            title="Combined Filters:"
            recommendedFilters={[
              "Female Doctors",
              "Available Today",
              "Video Consult",
              "Home Visit",
              "Free Followup",
              "Experience 10+ Years"
            ]}
            combinedFilters={true}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Filters (Desktop) */}
          <div className="hidden lg:block space-y-6">
            <DoctorFilters 
              selectedSpecialty={selectedSpecialty}
              setSelectedSpecialty={setSelectedSpecialty}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              specialties={specialties}
            />
          </div>
          
          {/* Doctors List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Mobile Filter Button */}
            <div className="lg:hidden flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">
                {filteredDoctors.length} doctors found
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                  <div className="h-full overflow-y-auto py-6 px-4">
                    <DoctorFilters 
                      selectedSpecialty={selectedSpecialty}
                      setSelectedSpecialty={setSelectedSpecialty}
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                      specialties={specialties}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          
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
