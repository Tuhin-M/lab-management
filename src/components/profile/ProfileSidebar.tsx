
import React from "react";
import { User, LockKeyhole, CalendarCheck, BarChart, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "profile", label: "Profile Information", icon: <User className="mr-3 h-5 w-5" /> },
    { id: "security", label: "Security", icon: <LockKeyhole className="mr-3 h-5 w-5" /> },
    { id: "appointments", label: "Appointments", icon: <CalendarCheck className="mr-3 h-5 w-5" /> },
    { id: "overview", label: "Health Overview", icon: <BarChart className="mr-3 h-5 w-5" /> },
    { id: "kyc", label: "KYC Verification", icon: <ShieldCheck className="mr-3 h-5 w-5" /> },
    { id: "dependents", label: "Family & Dependents", icon: <Users className="mr-3 h-5 w-5" /> },
  ];

  return (
    <aside className="w-full md:w-72 md:pr-4 mb-6 md:mb-0">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/20 p-4 sticky top-24">
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
                activeTab === tab.id
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "text-muted-foreground hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span className={cn(
                "relative z-10 flex items-center transition-colors duration-200",
                activeTab === tab.id ? "text-primary" : "text-muted-foreground group-hover:text-slate-900"
              )}>
                {React.cloneElement(tab.icon as React.ReactElement, {
                  className: cn("mr-3 h-5 w-5 transition-colors", activeTab === tab.id ? "text-primary" : "text-muted-foreground group-hover:text-primary")
                })}
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>
        
        <div className="mt-8 pt-6 border-t border-slate-100 px-4">
          <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-xl p-4 border border-primary/10">
             <h4 className="font-semibold text-primary mb-1 text-sm">Need Help?</h4>
             <p className="text-xs text-muted-foreground mb-3">Contact support for any issues with your profile.</p>
             <button className="text-xs font-medium text-primary hover:underline">Contact Support</button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
