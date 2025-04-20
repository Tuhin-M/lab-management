
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Plus, Video, LogOut } from "lucide-react";
import { authAPI } from "@/services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const LabDashboardHeader = () => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = React.useState(2); // Example count
  const [videoCallCount, setVideoCallCount] = React.useState(1); // Example count
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    // Get current user data
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
    
    // Check if user is logged in and is a lab owner
    if (!authAPI.isAuthenticated()) {
      toast.error("Please login to access Lab Dashboard");
      navigate("/login");
    } else if (authAPI.getCurrentUserRole() !== "lab_owner") {
      toast.error("You don't have permission to access Lab Dashboard");
      navigate("/");
    }
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await authAPI.logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };
  
  return (
    <div className="border-b bg-card">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex-1 md:flex-initial">
          <h1 className="text-xl font-semibold">Lab Dashboard</h1>
          <p className="text-sm text-muted-foreground hidden md:block">
            Welcome back, {currentUser?.name || 'Lab Owner'}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4 md:gap-6 lg:gap-8">
          <form className="hidden md:flex items-center gap-2 md:w-64 lg:w-80">
            <Input placeholder="Search labs, appointments..." className="h-9" />
          </form>
          <div className="flex items-center gap-2">
            {/* Video call notification */}
            <Button variant="outline" size="icon" className="relative">
              <Video className="h-5 w-5" />
              {videoCallCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                >
                  {videoCallCount}
                </Badge>
              )}
            </Button>
            {/* General notifications */}
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
            {/* Logout button */}
            <Button 
              variant="destructive" 
              size="sm"
              className="flex items-center"
              onClick={handleLogout}
            >
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate("/lab-owner/add-lab")} className="hidden md:flex">
            <Plus className="mr-2 h-4 w-4" />
            Add New Lab
          </Button>
          <Button onClick={() => navigate("/lab-owner/add-lab")} size="icon" className="md:hidden">
            <Plus className="h-5 w-5" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="md:hidden"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LabDashboardHeader;
