import React from "react";
import { authAPI } from "@/services/api";
import { Link } from "react-router-dom";

import { Home, FlaskConical, Users, Calendar, ClipboardList, Users2, LifeBuoy } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", icon: <Home size={20} />, tab: "dashboard" },
  { label: "Labs", icon: <FlaskConical size={20} />, tab: "labs" },
  { label: "Support", icon: <LifeBuoy size={20} />, tab: "support" },
  { label: "Bookings", icon: <ClipboardList size={20} />, tab: "bookings" },
  { label: "Team", icon: <Users2 size={20} />, tab: "team" },
  { label: "Calendar", icon: <Calendar size={20} />, tab: "calendar" },
];

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const role = authAPI.getCurrentUserRole();
  const linksToShow = sidebarLinks.filter(link => !(role === "lab_owner" && link.tab === "bookings"));
  return (
    <aside className="bg-gray-50 shadow-lg h-screen w-64 flex flex-col py-10 px-6 sticky top-0 z-20">
      <div className="flex flex-col items-center mb-8">
        <Link to="/" className="mb-2">
          <img
            src="/lovable-uploads/08ef7f9d-005e-4c81-a1b5-1420f8ce4d9b.png"
            alt="Ekitsa Logo"
            className="w-16 h-16 rounded-full border-2 border-accent shadow-sm"
          />
        </Link>
        <div className="font-extrabold text-xl tracking-wide text-accent">Ekitsa</div>
      </div>
      <hr className="mb-6 border-gray-200" />
      <nav className="flex-1">
        <ul className="flex flex-col gap-1">
          {linksToShow.map((link) => {
            const isActive = activeTab === link.tab;
            return (
              <li key={link.label}>
                <button
                  className={`flex items-center w-full py-3 px-5 mb-1 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-accent/10 text-accent-foreground border-l-4 border-accent font-semibold shadow-inner"
                      : "text-gray-600 hover:bg-accent/10 hover:text-accent-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setActiveTab(link.tab)}
                >
                  <span className={`mr-4 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${
                    isActive
                      ? "bg-accent/20 text-accent"
                      : "text-gray-400 group-hover:text-accent"
                  }`}>{link.icon}</span>
                  <span className={`truncate transition-colors duration-200 ${
                    isActive
                      ? "text-accent-foreground"
                      : "group-hover:text-accent-foreground"
                  }`}>{link.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
