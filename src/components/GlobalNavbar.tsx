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
        const user = await authAPI.getCurrentUser();
        setCurrentUser(user);
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
          <div className="bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-all duration-300 p-1">
            <img 
              src="src/assets/ekitsa_logo.png"
              alt="Ekitsa Logo" 
              className="h-10 md:h-16 w-auto" 
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
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 border-l border-white/20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-2xl">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <Link to="/" onClick={() => document.dispatchEvent(new CustomEvent('close-sheet'))}>
                      <img 
                        src="src/assets/ekitsa_logo.png" 
                        alt="Ekitsa Logo" 
                        className="h-14 w-auto"
                      />
                    </Link>
                  </div>
                  
                  {isAuthenticated && currentUser && (
                    <div className="mx-4 mt-6 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-white/20 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-primary/20 flex items-center justify-center">
                          <img 
                            src={currentUser?.user_metadata?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${currentUser?.email}`} 
                            alt={currentUser?.user_metadata?.name} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white truncate">{currentUser?.user_metadata?.name || "User"}</p>
                          <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <nav className="flex-1 overflow-y-auto p-4 py-6 space-y-1.5">
                    {[
                      { path: "/", label: "Home", icon: <HomeIcon className="h-5 w-5" /> },
                      { path: "/lab-tests", label: "Lab Tests", icon: <TestTube className="h-5 w-5" /> },
                      { path: "/doctors", label: "Doctors", icon: <Stethoscope className="h-5 w-5" /> },
                      { path: "/blog", label: "Blog", icon: <FileText className="h-5 w-5" /> },
                      { path: "/about", label: "About Us", icon: <Info className="h-5 w-5" /> }
                    ].map((link, idx) => (
                      <SheetClose key={link.path} asChild>
                        <Link 
                          to={link.path} 
                          className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                            isActive(link.path) && (link.path !== "/" || (!isActive("/lab-tests") && !isActive("/doctors")))
                              ? 'bg-primary text-black font-bold shadow-lg shadow-primary/25 scale-[1.02]' 
                              : 'text-muted-foreground hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-foreground hover:translate-x-1'
                          }`}
                        >
                          <div className={`p-2 rounded-xl transition-colors ${
                            isActive(link.path) && (link.path !== "/" || (!isActive("/lab-tests") && !isActive("/doctors")))
                              ? 'bg-black/10' 
                              : 'bg-muted group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300'
                          }`}>
                            {link.icon}
                          </div>
                          <span className="text-base tracking-tight">{link.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                    
                    {isAuthenticated && (
                      <div className="pt-4 space-y-1.5">
                        <div className="px-5 mb-2">
                          <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />
                        </div>
                        
                        {userRole === 'lab_owner' && (
                          <SheetClose asChild>
                            <Link to="/lab-dashboard" className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${isActive("/lab-dashboard") ? 'bg-primary text-black font-bold shadow-lg shadow-primary/25' : 'text-muted-foreground hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-foreground hover:translate-x-1'}`}>
                              <div className={`p-2 rounded-xl bg-muted group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300 ${isActive("/lab-dashboard") ? 'bg-black/10' : ''}`}>
                                <LayoutDashboard className="h-5 w-5" />
                              </div>
                              <span className="text-base tracking-tight">Dashboard</span>
                            </Link>
                          </SheetClose>
                        )}
                        <SheetClose asChild>
                          <Link to="/profile" className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${isActive("/profile") ? 'bg-primary text-black font-bold shadow-lg shadow-primary/25' : 'text-muted-foreground hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-foreground hover:translate-x-1'}`}>
                            <div className={`p-2 rounded-xl bg-muted group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300 ${isActive("/profile") ? 'bg-black/10' : ''}`}>
                              <User className="h-5 w-5" />
                            </div>
                            <span className="text-base tracking-tight">My Profile</span>
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </nav>
                  
                  {/* Footer Actions */}
                  <div className="p-6 border-t border-white/10 bg-white/30 dark:bg-slate-900/30">
                    {isAuthenticated ? (
                      <Button 
                        className="w-full h-12 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-500/10" 
                        variant="destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Button 
                          className="w-full h-12 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" 
                          onClick={() => navigate("/login")}
                        >
                          Login to Account
                        </Button>
                        <Button 
                          className="w-full h-12 rounded-2xl font-bold border-white/20 hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95" 
                          variant="outline"
                          onClick={() => navigate("/signup")}
                        >
                          Create Account
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
