
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Calendar, FileText, Settings, LogOut, Upload } from "lucide-react";
import { toast } from "sonner";

interface ProfileSidebarProps {
  avatarFile: File | null;
  avatarPreview: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileSidebar = ({ avatarFile, avatarPreview, handleFileChange }: ProfileSidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <Avatar className="w-24 h-24 border-4 border-background">
              <AvatarImage src={avatarPreview || undefined} />
              <AvatarFallback className="text-xl">JD</AvatarFallback>
            </Avatar>
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer">
              <Upload className="h-4 w-4" />
              <input 
                id="avatar-upload" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <h2 className="text-xl font-semibold">John Doe</h2>
          <p className="text-sm text-muted-foreground">john@example.com</p>
        </div>
        
        <div className="mt-8 space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/profile")}>
            <User className="mr-2 h-4 w-4" /> My Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/appointments")}>
            <Calendar className="mr-2 h-4 w-4" /> My Appointments
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/health-records")}>
            <FileText className="mr-2 h-4 w-4" /> Health Records
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/settings")}>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
          <Button 
            variant="destructive" 
            className="w-full justify-start mt-6" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSidebar;
