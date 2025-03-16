
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DoctorAppointmentHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default DoctorAppointmentHeader;
