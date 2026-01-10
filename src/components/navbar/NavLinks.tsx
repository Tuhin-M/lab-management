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
    { path: "/", label: "Home", icon: <Home className="h-6 w-6" /> },
    { path: "/lab-tests", label: "Lab Tests", icon: <TestTube className="h-6 w-6" /> },
    { path: "/doctors", label: "Doctors", icon: <Stethoscope className="h-6 w-6" /> },
    { path: "/community", label: "Community", icon: <FileText className="h-6 w-6" /> },
    { path: "/about", label: "About", icon: <Info className="h-6 w-6" /> }
  ];

  // Lab owner specific links
  const labOwnerLinks = [
    { path: "/", label: "Home", icon: <Home className="h-6 w-6" /> },
    { path: "/lab-dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-6 w-6" /> },
    { path: "/blog", label: "Blog", icon: <FileText className="h-6 w-6" /> }
  ];

  const links = userRole === 'lab_owner' ? labOwnerLinks : commonLinks;

  return (
    <nav className="flex items-center space-x-2 p-2 bg-muted/40 dark:bg-slate-900/40 backdrop-blur-md rounded-full border border-white/20">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`relative flex items-center gap-2.5 px-6 py-2.5 text-base font-bold rounded-full transition-all duration-300 group ${
            isActive(link.path) 
              ? "bg-primary text-black shadow-[0_4px_12px_-4px_rgba(var(--primary),0.4)] scale-105" 
              : "text-muted-foreground hover:text-foreground hover:bg-white/10 hover:scale-105"
          }`}
        >
          <span className="relative z-10 flex items-center gap-2.5">
            {React.cloneElement(link.icon as React.ReactElement, { 
              className: `h-5 w-5 transition-transform duration-300 ${isActive(link.path) ? "" : "group-hover:scale-110"}` 
            })}
            {link.label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
