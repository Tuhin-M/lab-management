
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TestTube, User } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow container mx-auto py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
            Your Health Companion
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Get lab tests and doctor appointments easily in one place. Compare options, book online, and manage your health journey.
          </p>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="bg-card border rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TestTube className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Lab Tests</h2>
              <p className="text-muted-foreground mb-6">
                Compare lab prices, see reviews, and book tests online with ease.
              </p>
              <Button 
                size="lg" 
                className="mt-auto" 
                onClick={() => navigate("/lab-tests")}
              >
                Find Lab Tests
              </Button>
            </div>

            <div className="bg-card border rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Doctor Appointments</h2>
              <p className="text-muted-foreground mb-6">
                Book appointments with trusted specialists across multiple specialties.
              </p>
              <Button 
                size="lg" 
                className="mt-auto"
                onClick={() => navigate("/doctors")}
              >
                Find Doctors
              </Button>
            </div>
          </div>
        </div>
      </main>

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
