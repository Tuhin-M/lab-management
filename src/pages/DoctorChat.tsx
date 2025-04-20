
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DoctorChatComponent from "@/components/doctor/DoctorChat";
import { doctorsAPI } from "@/services/api";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  image: string;
}

const DoctorChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      
      try {
        const response = await doctorsAPI.getDoctorById(id);
        setDoctor(response.data);
      } catch (error) {
        console.error("Failed to fetch doctor details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctor();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!doctor || !id) {
    return (
      <div className="container mx-auto p-6">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Doctor not found</h2>
          <p className="text-muted-foreground">
            We couldn't find this doctor. Please try again or select another doctor.
          </p>
          <Button 
            className="mt-6"
            onClick={() => navigate('/doctors')}
          >
            Browse Doctors
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-2">Chat with Dr. {doctor.name}</h1>
        <p className="text-muted-foreground mb-6">
          Use the chat below to communicate with your doctor. You can also start a video consultation if needed.
        </p>
        
        <DoctorChatComponent 
          doctorId={id}
          doctorName={doctor.name}
          doctorImage={doctor.image}
        />
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Need help? Contact our support team at support@ekitsa.com</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorChatPage;
