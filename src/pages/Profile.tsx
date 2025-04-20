
import React, { useState } from "react";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileInformationTab from "@/components/profile/ProfileInformationTab";
import SecurityTab from "@/components/profile/SecurityTab";
import AppointmentsTab from "@/components/profile/AppointmentsTab";
import HealthOverviewTab from "@/components/profile/HealthOverviewTab";
import KycVerificationTab from "@/components/profile/KycVerificationTab";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>
            
            <Tabs value={activeTab} className="mb-6">
              <TabsContent value="profile">
                <ProfileInformationTab />
              </TabsContent>
              <TabsContent value="security">
                <SecurityTab />
              </TabsContent>
              <TabsContent value="appointments">
                <AppointmentsTab />
              </TabsContent>
              <TabsContent value="overview">
                <HealthOverviewTab />
              </TabsContent>
              <TabsContent value="kyc">
                <KycVerificationTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
