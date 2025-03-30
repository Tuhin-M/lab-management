
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { 
  TestTube, 
  User, 
  Bell, 
  Menu, 
  Home as HomeIcon, 
  ShoppingBag, 
  FileText 
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const GlobalNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/08ef7f9d-005e-4c81-a1b5-1420f8ce4d9b.png" 
            alt="Ekitsa Logo" 
            className="h-8 md:h-10"
          />
        </Link>

        {/* Navigation for Desktop */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle() + (isActive("/") && !isActive("/lab-tests") && !isActive("/doctors") ? " bg-accent/50" : "")}
                  >
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/lab-tests">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle() + (isActive("/lab-tests") ? " bg-accent/50" : "")}
                  >
                    <TestTube className="mr-2 h-4 w-4" />
                    Lab Tests
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/doctors">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle() + (isActive("/doctors") ? " bg-accent/50" : "")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Doctor Appointments
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/orders">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle() + (isActive("/orders") ? " bg-accent/50" : "")}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="hidden md:flex" onClick={() => navigate('/profile')}>
            <User className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="hidden md:flex">
            <Bell className="h-4 w-4" />
          </Button>
          <Button className="hidden md:flex" onClick={() => navigate("/login")}>
            Login / Signup
          </Button>

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
                  
                  <h2 className="text-lg font-bold mb-4">Menu</h2>
                  <nav className="flex flex-col space-y-2">
                    <Link to="/" className={`flex items-center p-2 rounded-md ${isActive("/") && !isActive("/lab-tests") && !isActive("/doctors") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}>
                      <HomeIcon className="mr-2 h-4 w-4" />
                      Home
                    </Link>
                    <Link to="/lab-tests" className={`flex items-center p-2 rounded-md ${isActive("/lab-tests") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}>
                      <TestTube className="mr-2 h-4 w-4" />
                      Lab Tests
                    </Link>
                    <Link to="/doctors" className={`flex items-center p-2 rounded-md ${isActive("/doctors") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}>
                      <User className="mr-2 h-4 w-4" />
                      Doctor Appointments
                    </Link>
                    <Link to="/orders" className={`flex items-center p-2 rounded-md ${isActive("/orders") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                    <Link to="/profile" className={`flex items-center p-2 rounded-md ${isActive("/profile") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </nav>
                  <div className="pt-4 border-t mt-4">
                    <Button className="w-full" onClick={() => navigate("/login")}>Login / Signup</Button>
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

export default GlobalNavbar;
