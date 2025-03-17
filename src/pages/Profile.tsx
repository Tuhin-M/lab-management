
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User, Settings, Calendar, Lock, LogOut, Upload } from "lucide-react";
import TopNavigation from "@/components/TopNavigation";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

// Sample appointment data
const appointments = [
  {
    id: 1,
    type: "Lab Test",
    name: "Complete Blood Count (CBC)",
    date: "2023-06-15",
    time: "10:30 AM",
    status: "Completed",
    lab: "HealthPlus Diagnostics"
  },
  {
    id: 2,
    type: "Doctor",
    name: "Dr. Rahul Sharma - Cardiologist",
    date: "2023-07-22",
    time: "4:00 PM",
    status: "Upcoming",
    location: "Apollo Hospital"
  },
  {
    id: R3,
    type: "Lab Test",
    name: "Lipid Profile",
    date: "2023-08-10",
    time: "9:00 AM",
    status: "Scheduled",
    lab: "Metropolis Labs"
  }
];

const Profile = () => {
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "John Doe",
      email: "john@example.com",
      phone: "9876543210",
      address: "123 Main Street, Bangalore",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    toast.success("Profile updated successfully");
    console.log("Profile data:", data);
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    toast.success("Password changed successfully");
    console.log("Password data:", data);
    passwordForm.reset();
  };

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

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavigation activeModule="doctors" />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        <div className="grid md:grid-cols-[250px_1fr] gap-6">
          {/* Profile sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="w-24 h-24 border-4 border-background">
                      <AvatarImage src={avatarPreview || undefined} />
                      <AvatarFallback className="text-xl">JD</AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer">
                      <Upload className="h-4 w-4" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <h2 className="text-xl font-semibold">John Doe</h2>
                  <p className="text-sm text-muted-foreground">john@example.com</p>
                </div>
                
                <div className="mt-8 space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" /> My Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/appointments")}>
                    <Calendar className="mr-2 h-4 w-4" /> My Appointments
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start mt-6" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
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
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input type="tel" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit">Save Changes</Button>
                      </form>
                    </Form>
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
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <Card key={appointment.id} className="p-4 hover:bg-accent/50 transition-colors">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">{appointment.type}</div>
                              <div className="font-medium">{appointment.name}</div>
                              <div className="text-sm mt-1">
                                {appointment.type === "Lab Test" ? appointment.lab : appointment.location}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center space-x-1 text-sm">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(appointment.date).toLocaleDateString()}</span>
                              </div>
                              <div className="text-sm">{appointment.time}</div>
                              <span className={`inline-flex px-2 py-1 mt-1 text-xs rounded-full ${
                                appointment.status === "Completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : appointment.status === "Upcoming" 
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
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
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit">Change Password</Button>
                      </form>
                    </Form>

                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-medium mb-4 flex items-center">
                        <Lock className="h-4 w-4 mr-2" /> 
                        Account Security
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Two-factor authentication</p>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Button variant="outline">Enable</Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Active sessions</p>
                            <p className="text-sm text-muted-foreground">
                              Manage your active login sessions
                            </p>
                          </div>
                          <Button variant="outline">View</Button>
                        </div>
                      </div>
                    </div>
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
