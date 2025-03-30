
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

const DoctorAppointmentHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-primary">
              <Link to="/">Ekitsa</Link>
            </h1>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/lab-tests" className={navigationMenuTriggerStyle()}>
                    Labs
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/doctors" className={navigationMenuTriggerStyle()}>
                    Doctors
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
            <Button onClick={() => navigate('/signup')}>Sign Up</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DoctorAppointmentHeader;
