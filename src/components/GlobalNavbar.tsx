
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserMenu from "@/components/navbar/UserMenu";
import NavLinks from "@/components/navbar/NavLinks";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { 
  TestTube, 
  User, 
  Bell, 
  Menu, 
  Home as HomeIcon, 
  ShoppingBag, 
  FileText,
  CalendarCheck,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authAPI } from "@/services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const GlobalNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authAPI.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        setUserRole(authAPI.getCurrentUserRole());
        setCurrentUser(authAPI.getCurrentUser());
      } else {
        setUserRole(null);
        setCurrentUser(null);
      }
    };
    
    checkAuth();
  }, [location.pathname]);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

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
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/08ef7f9d-005e-4c81-a1b5-1420f8ce4d9b.png" 
            alt="Ekitsa Logo" 
            className="h-10 md:h-12" 
          />
        </Link>

        {/* Navigation for Desktop - now uses NavLinks subcomponent */}
        <div className="hidden md:block">
          <NavLinks isAuthenticated={isAuthenticated} userRole={userRole} />
        </div>

        {/* User Actions - now uses UserMenu subcomponent */}
        <div className="flex items-center space-x-2">
          {isAuthenticated && currentUser ? (
            <UserMenu currentUser={currentUser} onLogout={handleLogout} />
          ) : (
            <Button 
              className="hidden md:flex" 
              onClick={() => navigate("/login")}
            >
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
                      className="h-10"
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
                    
                    {isAuthenticated && (
                      <>
                        <Link to="/orders" className={`flex items-center p-2 rounded-md ${isActive("/orders") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}>
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Orders
                        </Link>
                        <Link to="/health-records" className={`flex items-center p-2 rounded-md ${isActive("/health-records") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          Health Records
                        </Link>
                        <Link to="/profile" className={`flex items-center p-2 rounded-md ${isActive("/profile") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                        
                        {userRole === 'lab_owner' && (
                          <Link to="/lab-dashboard" className={`flex items-center p-2 rounded-md ${isActive("/lab-dashboard") ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Lab Dashboard
                          </Link>
                        )}
                      </>
                    )}
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
                      <Button 
                        className="w-full" 
                        onClick={() => navigate("/login")}
                      >
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

export default GlobalNavbar;
