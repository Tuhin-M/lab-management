
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Bell, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

const LabDashboardHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="border-b bg-card">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex-1 md:flex-initial">
          <h1 className="text-xl font-semibold">Lab Dashboard</h1>
        </div>
        <div className="hidden md:flex items-center gap-4 md:gap-6 lg:gap-8">
          <form className="hidden md:flex items-center gap-2 md:w-64 lg:w-80">
            <Input placeholder="Search labs, appointments..." className="h-9" />
          </form>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
        </div>
        <div className="flex items-center">
          <Button onClick={() => navigate("/lab-owner/add-lab")} className="hidden md:flex">
            <Plus className="mr-2 h-4 w-4" />
            Add New Lab
          </Button>
          <Button onClick={() => navigate("/lab-owner/add-lab")} size="icon" className="md:hidden">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LabDashboardHeader;
