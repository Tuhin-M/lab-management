import React, { useState, useEffect } from "react";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileInformationTab from "@/components/profile/ProfileInformationTab";
import SecurityTab from "@/components/profile/SecurityTab";
import AppointmentsTab from "@/components/profile/AppointmentsTab";
import HealthOverviewTab from "@/components/profile/HealthOverviewTab";
import KycVerificationTab from "@/components/profile/KycVerificationTab";
import DependentsTab from "@/components/profile/DependentsTab";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { authAPI } from "@/services/api";
import { motion } from "framer-motion";
import LoadingFallback from "@/utils/LoadingFallback";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authAPI.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="fixed left-0 top-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="fixed right-0 bottom-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <main className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your account settings, medical history, and dependents.</p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8">
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
            
            <div className="flex-1">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Tabs value={activeTab} className="w-full">
                  <TabsContent value="profile" className="mt-0">
                    <ProfileInformationTab user={user} />
                  </TabsContent>
                  <TabsContent value="security" className="mt-0">
                    <SecurityTab />
                  </TabsContent>
                  <TabsContent value="appointments" className="mt-0">
                    <AppointmentsTab />
                  </TabsContent>
                  <TabsContent value="overview" className="mt-0">
                    <HealthOverviewTab />
                  </TabsContent>
                  <TabsContent value="kyc" className="mt-0">
                    <KycVerificationTab />
                  </TabsContent>
                  <TabsContent value="dependents" className="mt-0">
                    <DependentsTab />
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
