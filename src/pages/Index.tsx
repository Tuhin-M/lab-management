
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TestTube, User, ArrowRight } from "lucide-react";
import HomeSearch from "@/components/HomeSearch";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary/5 py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Your Health Companion
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Get lab tests and doctor appointments easily in one place. Compare options, book online, and manage your health journey.
            </p>
            
            <HomeSearch className="max-w-3xl mx-auto" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          <div className="bg-card border rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <TestTube className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Lab Tests</h2>
            <p className="text-muted-foreground mb-6">
              Compare lab prices, see reviews, and book tests online with ease. Get tested at home or visit a lab near you.
            </p>
            <Button 
              size="lg" 
              className="mt-auto group" 
              onClick={() => navigate("/lab-tests")}
            >
              Find Lab Tests
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="bg-card border rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Doctor Appointments</h2>
            <p className="text-muted-foreground mb-6">
              Book appointments with trusted specialists across multiple specialties. Choose from over 10,000 doctors.
            </p>
            <Button 
              size="lg" 
              className="mt-auto group"
              onClick={() => navigate("/doctors")}
            >
              Find Doctors
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t">
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

export default Index;
