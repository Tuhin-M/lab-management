import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LayoutDashboard, FileText, TestTube, Stethoscope, Info } from "lucide-react";

interface NavLinksProps {
  isAuthenticated: boolean;
  userRole: string | null;
}

const NavLinks: React.FC<NavLinksProps> = ({ isAuthenticated, userRole }) => {
  const location = useLocation();
  const isActive = (path: string) => 
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  // Clean navigation - removed Tests and Appointments for regular users
  const commonLinks = [
    { path: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { path: "/lab-tests", label: "Lab Tests", icon: <TestTube className="h-4 w-4" /> },
    { path: "/doctors", label: "Doctors", icon: <Stethoscope className="h-4 w-4" /> },
    { path: "/blog", label: "Blog", icon: <FileText className="h-4 w-4" /> },
    { path: "/about", label: "About", icon: <Info className="h-4 w-4" /> }
  ];

  // Lab owner specific links
  const labOwnerLinks = [
    { path: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { path: "/lab-dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { path: "/blog", label: "Blog", icon: <FileText className="h-4 w-4" /> }
  ];

  const links = userRole === 'lab_owner' ? labOwnerLinks : commonLinks;

  return (
    <nav className="flex items-center space-x-1.5 p-1 bg-muted/30 rounded-full border border-white/10">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 group ${
            isActive(link.path) 
              ? "bg-primary text-black shadow-[0_2px_10px_-3px_rgba(var(--primary),0.3)]" 
              : "text-muted-foreground hover:text-foreground hover:bg-white/10"
          }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            {React.cloneElement(link.icon as React.ReactElement, { 
              className: `h-4 w-4 transition-transform duration-300 ${isActive(link.path) ? "" : "group-hover:scale-110"}` 
            })}
            {link.label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
