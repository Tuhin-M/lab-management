
import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { TestTube, User, Bell, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface TopNavigationProps {
  activeModule: "labs" | "doctors";
}

const TopNavigation = ({ activeModule }: TopNavigationProps) => {
  return (
    <header className="border-b sticky top-0 z-50 bg-white">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="font-bold text-lg hidden md:inline-block">Ekitsa</span>
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
          <Button variant="outline" size="icon" className="hidden md:flex">
            <Bell className="h-4 w-4" />
          </Button>
          <Button className="hidden md:flex">
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
                    <Button className="w-full">Login / Signup</Button>
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
