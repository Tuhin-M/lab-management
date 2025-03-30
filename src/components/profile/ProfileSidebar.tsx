
import React from "react";
import { User, LockKeyhole, CalendarCheck, BarChart, ShieldCheck } from "lucide-react";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "profile", label: "Profile Information", icon: <User className="mr-2 h-4 w-4" /> },
    { id: "security", label: "Security", icon: <LockKeyhole className="mr-2 h-4 w-4" /> },
    { id: "appointments", label: "Appointments", icon: <CalendarCheck className="mr-2 h-4 w-4" /> },
    { id: "overview", label: "Health Overview", icon: <BarChart className="mr-2 h-4 w-4" /> },
    { id: "kyc", label: "KYC Verification", icon: <ShieldCheck className="mr-2 h-4 w-4" /> },
  ];

  return (
    <aside className="w-full md:w-64 md:pr-8 mb-6 md:mb-0">
      <nav className="space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
