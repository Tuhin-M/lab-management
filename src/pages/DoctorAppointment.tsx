
import React, { useState, useEffect } from "react";
import { ArrowLeft, Filter, MapPin, MessageCircle, Search, Stethoscope, Users, Star, Clock, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { motion } from "framer-motion";
import RecommendedFilters from "@/components/RecommendedFilters";
import DoctorFilters from "@/components/doctor/DoctorFilters";
import DoctorCard from "@/components/doctor/DoctorCard";
import { doctorsAPI, authAPI } from "@/services/api";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;
  fee: number;
  image: string;
  imageUrl: string;
  experience: number;
  languages: string[];
  education: string;
  qualifications: string;
  about: string;
  availability: string[];
  verified: boolean;
  nextAvailable: string;
  availableToday: boolean;
  consultationOptions: ("video" | "in-person" | "phone")[];
  discountedFee?: number;
  distance: number;
  gender: "male" | "female";
}

const DoctorAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [location, setLocation] = useState("Bengaluru");
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const { data } = await doctorsAPI.getAllDoctors();
        if (data) {
           // Map Supabase data to Doctor interface
           const mappedDoctors = data.map((d: any) => ({
             id: d.id,
             name: d.name,
             specialty: d.specialty,
             hospital: d.hospital,
             location: d.location,
             city: d.city,
             rating: d.rating,
             reviewCount: Math.floor(Math.random() * 100) + 20, // Mock review count
             fee: d.fee,
             image: d.image_url, // For local interface
             imageUrl: d.image_url, // For DoctorCard
             experience: d.experience,
             languages: d.languages || ["English", "Hindi"],
             education: "MBBS, MD", // Mock education/qualifications
             qualifications: "MBBS, MD", // For DoctorCard
             about: d.bio,
             availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
             verified: d.verified,
             nextAvailable: "Today",
             availableToday: true,
             consultationOptions: (d.consultation_options || ['in-person']) as ("video" | "in-person" | "phone")[],
             discountedFee: Math.floor(d.fee * 0.8 / 100) * 100, // Mock discount
             distance: parseFloat((Math.random() * 10).toFixed(1)), // Mock distance
             gender: (d.gender || "male") as "male" | "female"
           }));
           
           setDoctors(mappedDoctors);
           // Extract unique cities
           const uniqueCities = Array.from(new Set(data.map((d: any) => d.city))).filter((c): c is string => typeof c === 'string');
           setCities(uniqueCities.length > 0 ? uniqueCities : ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai"]);
        }
      } catch (error) {
        console.error("Failed to fetch doctors", error);
        toast({
          title: "Error",
          description: "Failed to load doctors list",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [toast]);

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

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    setLocationDialogOpen(false);
    toast({
      title: "Location Updated",
      description: `Showing doctors in ${newLocation}`,
    });
  };
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery.trim() === "" || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
    
    // Loose match for city since format might vary
    const matchesCity = doctor.city.includes(location.split(',')[0]);
    
    return matchesSearch && matchesSpecialty && matchesCity;
  });
  
  const handleBookAppointment = async (doctorId: string) => {
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
    
    try {
      await doctorsAPI.bookAppointment({
        doctorId,
        date: format(selectedDate, "yyyy-MM-dd"),
        timeSlot: selectedTimeSlot,
        fee: doctor?.fee || 500,
        patientName: "Self", // Should be dynamic in real app
        patientPhone: "9999999999" // Should be dynamic
      });

      toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${doctor?.name} is scheduled for ${format(selectedDate, "PPP")} at ${selectedTimeSlot}`,
      });
      
      setSelectedDoctor(null);
      setSelectedDate(undefined);
      setSelectedTimeSlot(null);
    } catch (error) {
      console.error(error);
      toast({
         title: "Booking Failed",
         description: "Please try again later or login if not authenticated.",
         variant: "destructive"
      });
    }
  };
  
  const handleChatWithDoctor = (doctorId: string) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Finding the best doctors for you...</p>
        </div>
      </div>
    );
  }

  // Stats for the hero section
  const stats = [
    { icon: Users, label: "Doctors", value: `${doctors.length}+`, color: "blue" },
    { icon: Stethoscope, label: "Specialties", value: `${specialties.length}`, color: "green" },
    { icon: Star, label: "Avg Rating", value: "4.8", color: "yellow" },
    { icon: Clock, label: "Available", value: "24/7", color: "purple" },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  return (
    <div className="min-h-screen bg-slate-50/50 pt-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="fixed left-0 top-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="fixed right-0 bottom-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <main className="container mx-auto px-4 py-6 relative z-10">
        {/* Premium Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-cyan-500/10 rounded-3xl p-8 border border-white/20 backdrop-blur-md shadow-xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-primary/20 rounded-xl">
                      <Stethoscope className="h-7 w-7 text-primary" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Find Doctors</h1>
                  </div>
                  <p className="text-muted-foreground text-lg">Book appointments with top specialists near you</p>
                  
                  {/* Location */}
                  <div className="flex items-center gap-2 mt-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <Button 
                      variant="ghost" 
                      className="text-sm font-medium hover:bg-white/50 -ml-2"
                      onClick={() => setLocationDialogOpen(true)}
                    >
                      {location} <span className="text-primary ml-1 font-semibold">Change</span>
                    </Button>
                  </div>
                </div>
                
                {/* Search Bar */}
                <div className="lg:w-[400px]">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search doctors, specialties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-6 text-base rounded-2xl border-white/30 bg-white/80 backdrop-blur-sm shadow-lg focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
              
              {/* Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        stat.color === 'blue' ? 'bg-blue-100' :
                        stat.color === 'green' ? 'bg-green-100' :
                        stat.color === 'yellow' ? 'bg-yellow-100' : 'bg-purple-100'
                      }`}>
                        <stat.icon className={`h-5 w-5 ${
                          stat.color === 'blue' ? 'text-blue-600' :
                          stat.color === 'green' ? 'text-green-600' :
                          stat.color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'
                        }`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
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

      {/* Location Selection Dialog */}
      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Select Your City
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {cities.map((city) => (
              <Button
                key={city}
                variant={location === city ? "default" : "outline"}
                className={`justify-start text-left h-auto py-3 ${
                  location === city 
                    ? "bg-primary text-white" 
                    : "hover:bg-primary/10 hover:border-primary"
                }`}
                onClick={() => handleLocationChange(city)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {city}
                {location === city && (
                  <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded">Current</span>
                )}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorAppointment;
