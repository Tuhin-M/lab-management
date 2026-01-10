import React from "react";
import { User, LockKeyhole, CalendarCheck, BarChart, ShieldCheck, Users, LogOut, HelpCircle, ChevronRight, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, setActiveTab, user }) => {
  const navigate = useNavigate();

  const tabs = [
    { id: "profile", label: "Profile Information", icon: User, badge: null },
    { id: "security", label: "Security", icon: LockKeyhole, badge: null },
    { id: "appointments", label: "Appointments", icon: CalendarCheck, badge: "3" },
    { id: "overview", label: "Health Overview", icon: BarChart, badge: null },
    { id: "kyc", label: "KYC Verification", icon: ShieldCheck, badge: "Pending" },
    { id: "dependents", label: "Family & Dependents", icon: Users, badge: "2" },
  ];

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleContactSupport = () => {
    toast.info("Opening support chat...");
  };

  const userInitials = user?.user_metadata?.name
    ? user.user_metadata.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "JD";

  return (
    <aside className="w-full md:w-80 md:pr-4 mb-6 md:mb-0">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden sticky top-24">
        {/* User Profile Header */}
        <div className="p-6 bg-gradient-to-br from-primary/10 to-blue-500/10 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              <AvatarImage src={user?.user_metadata?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email}`} />
              <AvatarFallback className="text-xl bg-primary text-white">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate">{user?.user_metadata?.name || "User"}</h3>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                  Verified
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                activeTab === tab.id
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "text-muted-foreground hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span className="flex items-center gap-3">
                <tab.icon className={cn(
                  "h-5 w-5 transition-colors",
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )} />
                {tab.label}
              </span>
              <div className="flex items-center gap-2">
                {tab.badge && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      tab.badge === "Pending" ? "bg-amber-100 text-amber-700" : "bg-slate-100"
                    )}
                  >
                    {tab.badge}
                  </Badge>
                )}
                <ChevronRight className={cn(
                  "h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity",
                  activeTab === tab.id && "opacity-100"
                )} />
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </nav>
        
        {/* Quick Actions */}
        <div className="p-3 pt-0 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-slate-900 rounded-xl"
            onClick={() => navigate("/orders")}
          >
            <Settings className="h-5 w-5 mr-3" />
            My Orders
          </Button>
        </div>

        {/* Help Section */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-xl p-4 border border-primary/10">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Need Help?</h4>
                <p className="text-xs text-muted-foreground mb-3">Contact support for any issues</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full rounded-lg text-xs h-8"
                  onClick={handleContactSupport}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 pt-0">
          <Button 
            variant="outline" 
            className="w-full rounded-xl text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
