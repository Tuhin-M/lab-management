
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="bg-primary/5 pt-16 pb-12 md:pb-24">
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="rounded-full bg-white w-8 h-8 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">E</span>
                </div>
                <span className="font-bold text-white text-lg">Ekitsa</span>
              </div>
              <p className="text-sm mb-4">
                Your one-stop healthcare platform for booking lab tests and doctor appointments
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/labs" className="hover:text-white">Lab Tests</Link></li>
                <li><Link to="/doctors" className="hover:text-white">Find Doctors</Link></li>
                <li><Link to="/blog" className="hover:text-white">Health Blog</Link></li>
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">For Patients</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
                <li><Link to="/booking" className="hover:text-white">Booking Process</Link></li>
                <li><Link to="/reports" className="hover:text-white">View Reports</Link></li>
                <li><Link to="/help" className="hover:text-white">Help & Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5" />
                  <span>123 Healthcare Avenue, Bangalore, India 560001</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@ekitsa.com</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+91 9876543210</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>© 2023 Ekitsa. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms of Service</Link>
              <Link to="/refund" className="hover:text-white">Refund Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
