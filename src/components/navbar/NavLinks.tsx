import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, TestTube, LayoutDashboard, User, CalendarCheck, FileText } from "lucide-react";

interface NavLinksProps {
  isAuthenticated: boolean;
  userRole: string | null;
}

const NavLinks: React.FC<NavLinksProps> = ({ isAuthenticated, userRole }) => {
  const location = useLocation();
  const isActive = (path: string) => 
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const commonLinks = [
    { path: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { path: "/tests", label: "Tests", icon: <TestTube className="h-4 w-4" /> },
    { path: "/blog", label: "Blog", icon: <FileText className="h-4 w-4" /> }
  ];

  const authenticatedUserLinks = [
    { path: "/appointments", label: "Appointments", icon: <CalendarCheck className="h-4 w-4" /> },
    { path: "/profile", label: "Profile", icon: <User className="h-4 w-4" /> }
  ];

  const labOwnerLinks = [
    { path: "/lab-dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { path: "/lab-appointments", label: "Lab Appointments", icon: <CalendarCheck className="h-4 w-4" /> },
    { path: "/lab-tests", label: "Lab Tests", icon: <TestTube className="h-4 w-4" /> }
  ];

  return (
    <nav className="flex items-center space-x-6">
      {/* Common links for all users */}
      {commonLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-muted-foreground"}`}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}

      {/* Regular user links (not shown to lab owners) */}
      {isAuthenticated && userRole !== 'lab_owner' && 
        authenticatedUserLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-muted-foreground"}`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))
      }

      {/* Lab owner sees both regular and lab-specific links */}
      {isAuthenticated && userRole === 'lab_owner' && (
        <>
          {authenticatedUserLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-muted-foreground"}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {labOwnerLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-muted-foreground"}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </>
      )}
    </nav>
  );
};

export default NavLinks;
