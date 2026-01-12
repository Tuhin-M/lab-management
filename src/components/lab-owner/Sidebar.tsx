import React from "react";
import { authAPI } from "@/services/api";
import { Link } from "react-router-dom";

import { Home, FlaskConical, Users, Calendar, ClipboardList, Users2, LifeBuoy, CreditCard, Package, BarChart3, Settings } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", icon: <Home size={20} />, tab: "dashboard" },
  { label: "Labs", icon: <FlaskConical size={20} />, tab: "labs" },
  { label: "Bookings", icon: <ClipboardList size={20} />, tab: "bookings" },
  { label: "Calendar", icon: <Calendar size={20} />, tab: "calendar" },
  { label: "Team", icon: <Users2 size={20} />, tab: "team" },
  { label: "Billing", icon: <CreditCard size={20} />, tab: "billing" },
  { label: "Inventory", icon: <Package size={20} />, tab: "inventory" },
  { label: "Reports", icon: <BarChart3 size={20} />, tab: "reports" },
  { label: "Settings", icon: <Settings size={20} />, tab: "settings" },
  { label: "Support", icon: <LifeBuoy size={20} />, tab: "support" },
];

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const role = authAPI.getCurrentUserRole();
  const linksToShow = sidebarLinks.filter(link => !(role === "lab_owner" && link.tab === "bookings"));

  return (
    <aside className="bg-white border-r border-slate-200 h-screen w-64 flex flex-col py-8 px-4 sticky top-0 z-20 shadow-sm">
      <div className="px-4 mb-10">
        <Link to="/" className="flex items-center space-x-2">
          <div className="rounded-full bg-primary w-10 h-10 flex items-center justify-center shadow-sm shadow-primary/20">
            <span className="text-white font-bold text-base">E</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Ekitsa</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {linksToShow.map((link) => {
          const isActive = activeTab === link.tab;
          return (
            <button
              key={link.tab}
              onClick={() => setActiveTab(link.tab)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${isActive
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <div className={`mr-3 transition-colors duration-200 ${isActive ? "text-primary-foreground" : "text-slate-400 group-hover:text-primary"
                }`}>
                {React.cloneElement(link.icon as React.ReactElement, { size: 20 })}
              </div>
              {link.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/40" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
            <Users size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">Lab Admin</p>
            <p className="text-xs text-slate-500 truncate">Owner Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
