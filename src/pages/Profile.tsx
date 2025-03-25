
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopNavigation from "@/components/TopNavigation";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileInformationTab from "@/components/profile/ProfileInformationTab";
import AppointmentsTab from "@/components/profile/AppointmentsTab";
import HealthOverviewTab from "@/components/profile/HealthOverviewTab";
import SecurityTab from "@/components/profile/SecurityTab";

const Profile = () => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavigation activeModule="doctors" />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        <div className="grid md:grid-cols-[250px_1fr] gap-6">
          <div className="space-y-6">
            <ProfileSidebar 
              avatarFile={avatarFile}
              avatarPreview={avatarPreview}
              handleFileChange={handleFileChange}
            />
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="profile" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="health">Health Overview</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileInformationTab />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments">
                <Card>
                  <CardHeader>
                    <CardTitle>My Appointments</CardTitle>
                    <CardDescription>
                      View and manage your appointments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AppointmentsTab />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="health">
                <Card>
                  <CardHeader>
                    <CardTitle>Health Overview</CardTitle>
                    <CardDescription>
                      View your health records and metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <HealthOverviewTab />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Password & Security</CardTitle>
                    <CardDescription>
                      Change your password and manage security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SecurityTab />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
