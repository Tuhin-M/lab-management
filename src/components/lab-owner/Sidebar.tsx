import React from "react";

import { Home, FlaskConical, Users, Calendar, ClipboardList, Users2, LifeBuoy } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", icon: <Home size={20} />, tab: "dashboard" },
  { label: "Labs", icon: <FlaskConical size={20} />, tab: "labs" },
  { label: "Support", icon: <LifeBuoy size={20} />, tab: "support" },
  { label: "Patients", icon: <Users size={20} />, tab: "patients" },
  { label: "Bookings", icon: <ClipboardList size={20} />, tab: "bookings" },
  { label: "Team", icon: <Users2 size={20} />, tab: "team" },
  { label: "Calendar", icon: <Calendar size={20} />, tab: "calendar" },
];

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="bg-white shadow-xl h-screen w-60 flex flex-col py-8 px-4 rounded-r-2xl sticky top-0 z-20 border-r border-gray-100 overflow-y-auto">
      <div className="flex flex-col items-center mb-8">
        <img src="/placeholder.svg" alt="Lab Logo" className="w-16 h-16 rounded-full mb-2 border-2 border-indigo-200 shadow-sm" />
        <div className="font-extrabold text-xl tracking-wide text-indigo-700">LAB123</div>
      </div>
      <hr className="mb-6 border-gray-200" />
      <nav className="flex-1">
        <ul className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = activeTab === link.tab;
            return (
              <li key={link.label}>
                <button
                  className={`relative flex items-center w-full py-2.5 px-4 rounded-xl group transition-colors duration-150 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300
                    ${isActive ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-100 text-gray-700"}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setActiveTab(link.tab)}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded bg-indigo-600" aria-hidden="true"></span>
                  )}
                  <span className={`mr-4 flex items-center justify-center ${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-500"}`}>{link.icon}</span>
                  <span className="truncate">{link.label}</span>
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
