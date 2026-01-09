import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserMenu from "@/components/navbar/UserMenu";
import NavLinks from "@/components/navbar/NavLinks";
import { 
  TestTube, 
  User, 
  Menu, 
  Home as HomeIcon, 
  FileText,
  LogOut,
  LayoutDashboard,
  Stethoscope,
  Info,
  X
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { authAPI } from "@/services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const GlobalNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await authAPI.isAuthenticated();
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

  // Check if on home page for transparent header
  const isHomePage = location.pathname === "/";

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHomePage
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)]" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <img 
              src="src/assets/ekitsa_logo.png"
              alt="Ekitsa Logo" 
              className="h-10 md:h-14" 
            />
          </div>
        </Link>

        {/* Navigation for Desktop */}
        <div className="hidden md:block">
          <NavLinks isAuthenticated={isAuthenticated} userRole={userRole} />
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          {isAuthenticated && currentUser ? (
            <UserMenu currentUser={currentUser} onLogout={handleLogout} />
          ) : (
            <Button 
              className="hidden md:flex h-9 px-4 rounded-full" 
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <img 
                      src="/lovable-uploads/08ef7f9d-005e-4c81-a1b5-1420f8ce4d9b.png" 
                      alt="Ekitsa Logo" 
                      className="h-8"
                    />
                  </div>
                  
                  {isAuthenticated && currentUser && (
                    <div className="p-4 bg-muted/50 border-b">
                      <p className="font-medium text-sm">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    </div>
                  )}
                  
                  <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {[
                      { path: "/", label: "Home", icon: <HomeIcon className="h-5 w-5" /> },
                      { path: "/lab-tests", label: "Lab Tests", icon: <TestTube className="h-5 w-5" /> },
                      { path: "/doctors", label: "Doctors", icon: <Stethoscope className="h-5 w-5" /> },
                      { path: "/blog", label: "Blog", icon: <FileText className="h-5 w-5" /> },
                      { path: "/about", label: "About Us", icon: <Info className="h-5 w-5" /> }
                    ].map((link) => (
                      <SheetClose key={link.path} asChild>
                        <Link 
                          to={link.path} 
                          className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                            isActive(link.path) && (link.path !== "/" || (!isActive("/lab-tests") && !isActive("/doctors")))
                              ? 'bg-primary text-black font-semibold shadow-lg shadow-primary/20' 
                              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {link.icon}
                          <span className="text-base">{link.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                    
                    {isAuthenticated && (
                      <>
                        <div className="h-px bg-muted my-2 mx-4" />
                        {userRole === 'lab_owner' && (
                          <SheetClose asChild>
                            <Link to="/lab-dashboard" className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive("/lab-dashboard") ? 'bg-primary text-black font-semibold shadow-lg' : 'hover:bg-muted text-muted-foreground'}`}>
                              <LayoutDashboard className="h-5 w-5" />
                              <span className="text-base">Dashboard</span>
                            </Link>
                          </SheetClose>
                        )}
                        <SheetClose asChild>
                          <Link to="/profile" className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive("/profile") ? 'bg-primary text-black font-semibold shadow-lg' : 'hover:bg-muted text-muted-foreground'}`}>
                            <User className="h-5 w-5" />
                            <span className="text-base">My Profile</span>
                          </Link>
                        </SheetClose>
                      </>
                    )}
                  </nav>
                  
                  {/* Footer */}
                  <div className="p-6 border-t bg-muted/30">
                    {isAuthenticated ? (
                      <Button 
                        className="w-full h-12 rounded-xl font-bold shadow-lg" 
                        variant="destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Button 
                          className="w-full h-12 rounded-xl font-bold" 
                          onClick={() => navigate("/login")}
                        >
                          Login
                        </Button>
                        <Button 
                          className="w-full h-12 rounded-xl font-bold" 
                          variant="outline"
                          onClick={() => navigate("/signup")}
                        >
                          Join Now
                        </Button>
                      </div>
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
