
import React from "react";
import { FileText, Activity, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HealthOverviewTab = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-4 flex flex-col items-center">
            <FileText className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-medium text-center">Health Records</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Manage your prescriptions and test results
            </p>
            <Button 
              className="mt-4 w-full" 
              onClick={() => navigate('/health-records')}
            >
              View Records
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4 flex flex-col items-center">
            <Activity className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-medium text-center">Health Metrics</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Track your weight, blood pressure, and more
            </p>
            <Button 
              className="mt-4 w-full" 
              onClick={() => navigate('/health-records?tab=analytics')}
            >
              View Metrics
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 dark:bg-purple-900/20">
          <CardContent className="p-4 flex flex-col items-center">
            <Heart className="h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium text-center">Appointment History</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              View your past doctor visits and lab tests
            </p>
            <Button 
              className="mt-4 w-full" 
              onClick={() => navigate('/appointments')}
            >
              View History
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={() => navigate('/health-records')}
        >
          Manage Health Records
        </Button>
      </div>
    </>
  );
};

export default HealthOverviewTab;
