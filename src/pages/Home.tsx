
import React, { useState } from "react";
import { popularTests, popularSpecialties } from "@/constants/homeData";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Search, TestTube, User, Star, MapPin, Shield, Clock, Award } from "lucide-react";
import CitySelection from "@/components/CitySelection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Home = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [searchQuery, setSearchQuery] = useState("");

  const handleLabSearch = () => {
    navigate("/labs", { state: { city: selectedCity, query: searchQuery } });
  };

  const handleDoctorSearch = () => {
    navigate("/doctors", { state: { city: selectedCity, query: searchQuery } });
  };

  // Data imported from @/constants/homeData
// See src/constants/homeData.ts for details.

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      {/* Background Gradients & Patterns */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] opacity-60" />
      </div>

      {/* Hero Section */}
      <div className="pt-16 pb-12 md:pb-24 relative z-10">
        <header className="container mx-auto px-4 flex items-center justify-between h-16 absolute top-0 left-0 right-0">
          <Link to="/" className="flex items-center space-x-2">
            <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg">Ekitsa</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/about" className="text-sm font-medium hover:text-primary hidden md:inline-block">
              About Us
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary hidden md:inline-block">
              Blog
            </Link>
            <Button variant="outline" onClick={() => navigate("/login")} className="hidden md:inline-flex">
              Log In
            </Button>
            <Button onClick={() => navigate("/signup")}>Sign Up</Button>
          </div>
        </header>
        
        <div className="container mx-auto px-4 pt-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Your Health, Our Priority
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Book diagnostic tests and doctor appointments with the best healthcare providers in your city
            </p>

            <Card className="mx-auto max-w-2xl shadow-md">
              <CardContent className="p-6">
                <Tabs defaultValue="labs" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="labs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                      <TestTube className="h-4 w-4 mr-2" /> Lab Tests
                    </TabsTrigger>
                    <TabsTrigger value="doctors" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                      <User className="h-4 w-4 mr-2" /> Doctors
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="labs">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <CitySelection 
                          selectedCity={selectedCity} 
                          onCityChange={setSelectedCity} 
                          className="w-full md:w-auto"
                        />
                        <div className="relative flex-grow">
                          <Search className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="Search for tests or health packages"
                            className="pl-10 h-12 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button onClick={handleLabSearch} className="w-full h-12 text-base">
                        Search Lab Tests
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="doctors">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <CitySelection 
                          selectedCity={selectedCity} 
                          onCityChange={setSelectedCity} 
                          className="w-full md:w-auto"
                        />
                        <div className="relative flex-grow">
                          <Search className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="Search for doctors or specialties"
                            className="pl-10 h-12 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button onClick={handleDoctorSearch} className="w-full h-12 text-base">
                        Find Doctors
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Ekitsa?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Certified Labs & Doctors</h3>
            <p className="text-muted-foreground">
              All our partner labs are NABL accredited and doctors are verified specialists
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
            <p className="text-muted-foreground">
              Your data privacy is our priority with end-to-end encryption
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Convenient Booking</h3>
            <p className="text-muted-foreground">
              Easy online booking and scheduling with timely reminders
            </p>
          </div>
        </div>
      </section>

      {/* Popular Tests Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Popular Lab Tests</h2>
            <Button variant="outline" onClick={() => navigate("/labs")} className="gap-2">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTests.map(test => (
              <Card key={test.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">{test.name}</h3>
                    <div className="flex flex-col items-end">
                      <span className="text-sm line-through text-muted-foreground">₹{test.price}</span>
                      <span className="text-primary font-semibold">₹{test.discountPrice}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <TestTube className="h-3 w-3 mr-1" />
                      <span>Available at 14+ labs</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/labs?test=${test.name}`)}>
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Specialties Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Popular Specialties</h2>
          <Button variant="outline" onClick={() => navigate("/doctors")} className="gap-2">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularSpecialties.map(specialty => (
            <Card 
              key={specialty.id} 
              className="overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/doctors?specialty=${specialty.name}`)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="text-3xl mb-2">{specialty.icon}</div>
                <h3 className="font-medium text-sm mb-1">{specialty.name}</h3>
                <p className="text-xs text-muted-foreground">{specialty.count}+ doctors</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your health?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Ekitsa for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/signup")}>
              Sign Up Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/about")}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer is now global */}
    </div>
  );
};

export default Home;
