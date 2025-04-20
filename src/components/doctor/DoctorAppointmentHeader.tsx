import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Removing this component since we're now using the GlobalNavbar across the app
const DoctorAppointmentHeader: React.FC = () => {
  // This component is no longer needed as we're using the GlobalNavbar
  // But we'll keep it as an empty component to avoid breaking any imports
  return null;
};

export default DoctorAppointmentHeader;
