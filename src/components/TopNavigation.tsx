
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { TestTube, User, Bell, Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authAPI } from "@/services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface TopNavigationProps {
  activeModule: "labs" | "doctors";
}

const TopNavigation = ({ activeModule }: TopNavigationProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authAPI.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        setCurrentUser(authAPI.getCurrentUser());
      } else {
        setCurrentUser(null);
      }
    };
    
    checkAuth();
  }, []);
  
  const handleLogout = async () => {
    try {
      await authAPI.logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-white">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/08ef7f9d-005e-4c81-a1b5-1420f8ce4d9b.png" 
            alt="Ekitsa Logo" 
            className="h-8" 
          />
        </Link>

        {/* Navigation for Desktop */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/lab-tests">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle() + (activeModule === "labs" ? " bg-accent/50" : "")}
                  >
                    <TestTube className="mr-2 h-4 w-4" />
                    Lab Tests
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/doctors">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle() + (activeModule === "doctors" ? " bg-accent/50" : "")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Doctor Appointments
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              <Button variant="outline" size="icon" className="hidden md:flex">
                <Bell className="h-4 w-4" />
              </Button>
              <Button 
                className="hidden md:flex items-center" 
                variant="destructive" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button className="hidden md:flex" onClick={() => navigate("/login")}>
              Login / Signup
            </Button>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="py-4 space-y-4">
                  <div className="flex justify-center mb-6">
                    <img 
                      src="/lovable-uploads/08ef7f9d-005e-4c81-a1b5-1420f8ce4d9b.png" 
                      alt="Ekitsa Logo" 
                      className="h-8" 
                    />
                  </div>
                  
                  {isAuthenticated && currentUser && (
                    <div className="mb-4 pb-4 border-b">
                      <p className="font-medium">Hello, {currentUser.name}</p>
                      <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                    </div>
                  )}
                  
                  <h2 className="text-lg font-bold mb-4">Menu</h2>
                  <nav className="flex flex-col space-y-2">
                    <Link to="/lab-tests" className={`flex items-center p-2 rounded-md ${activeModule === 'labs' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}>
                      <TestTube className="mr-2 h-4 w-4" />
                      Lab Tests
                    </Link>
                    <Link to="/doctors" className={`flex items-center p-2 rounded-md ${activeModule === 'doctors' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}>
                      <User className="mr-2 h-4 w-4" />
                      Doctor Appointments
                    </Link>
                  </nav>
                  <div className="pt-4 border-t mt-4">
                    {isAuthenticated ? (
                      <Button 
                        className="w-full flex items-center justify-center" 
                        variant="destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => navigate("/login")}>
                        Login / Signup
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
