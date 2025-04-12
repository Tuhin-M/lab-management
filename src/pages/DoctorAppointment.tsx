
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, MapPin, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { motion } from "framer-motion";
import RecommendedFilters from "@/components/RecommendedFilters";
import DoctorAppointmentFooter from "@/components/doctor/DoctorAppointmentFooter";
import DoctorFilters from "@/components/doctor/DoctorFilters";
import DoctorCard from "@/components/doctor/DoctorCard";
import { doctors } from "@/data/doctorsData";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SearchBar from "@/components/SearchBar";
import { authAPI } from "@/services/api";

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
  
  const handleChatWithDoctor = (doctorId: string) => {
    // Check if user is logged in before redirecting to chat
    if (!authAPI.isAuthenticated()) {
      toast({
        title: "Login required",
        description: "You need to log in to chat with doctors",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    navigate(`/doctor-chat/${doctorId}`);
  };

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  // Staggered children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
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
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold">Find Doctors & Book Appointments</h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2 mb-4"
        >
          <MapPin className="h-5 w-5 text-primary" />
          <Button variant="outline" className="text-sm">
            {location} <span className="text-primary ml-1">Change</span>
          </Button>
        </motion.div>
        
        {/* Search Bar with reduced width */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <SearchBar 
            onSearch={(query) => setSearchQuery(query)} 
            maxWidth="max-w-2xl"
            context="doctor"
            animated={false}
          />
        </motion.div>
        
        {/* Quick Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6"
        >
          <RecommendedFilters 
            onFilterSelect={handleFilterSelect} 
            title="Quick Filters:"
            recommendedFilters={specialties}
          />
        </motion.div>
        
        {/* Combined Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-6"
        >
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
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Left Column - Filters (Desktop) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="hidden lg:block space-y-6"
          >
            <DoctorFilters 
              selectedSpecialty={selectedSpecialty}
              setSelectedSpecialty={setSelectedSpecialty}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              specialties={specialties}
            />
          </motion.div>
          
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
          
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {filteredDoctors.length === 0 ? (
                <motion.div 
                  variants={itemVariants}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">No doctors found matching your criteria.</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    setSearchQuery("");
                    setSelectedSpecialty("all");
                  }}>
                    Clear Filters
                  </Button>
                </motion.div>
              ) : (
                filteredDoctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <div className="relative">
                      <DoctorCard
                        doctor={doctor}
                        selectedDoctor={selectedDoctor}
                        selectedDate={selectedDate}
                        selectedTimeSlot={selectedTimeSlot}
                        setSelectedDoctor={setSelectedDoctor}
                        setSelectedDate={setSelectedDate}
                        setSelectedTimeSlot={setSelectedTimeSlot}
                        onBookAppointment={handleBookAppointment}
                      />
                      <div className="absolute top-4 right-4">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleChatWithDoctor(doctor.id)}
                          className="flex items-center gap-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Chat</span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <DoctorAppointmentFooter />
    </motion.div>
  );
};

export default DoctorAppointment;
