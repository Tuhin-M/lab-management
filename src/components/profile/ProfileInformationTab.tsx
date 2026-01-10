import React, { useRef, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Mail, Phone, MapPin, Save, Camera, CheckCircle, Droplet, Users, Pencil, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authAPI } from "@/services/api";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  address: z.string().optional(),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileInformationTabProps {
  user: any;
}

const PREDEFINED_AVATARS = [
  "https://api.dicebear.com/7.x/notionists/svg?seed=Annie",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Bob",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Grace",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Henry",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Sophie",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Marcus",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Emily",
  "https://api.dicebear.com/7.x/notionists/svg?seed=James",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Olivia",
  "https://api.dicebear.com/7.x/notionists/svg?seed=David",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Michael"
];

const ProfileInformationTab: React.FC<ProfileInformationTabProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.user_metadata?.name || "",
      email: user?.email || "",
      phone: user?.user_metadata?.phone || "",
      address: user?.user_metadata?.address || "",
      gender: user?.user_metadata?.gender || "",
      bloodGroup: user?.user_metadata?.bloodGroup || "",
      avatar: user?.user_metadata?.avatar || "",
    },
  });

  // Update form values if user prop changes
  React.useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.user_metadata?.name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
        address: user.user_metadata?.address || "",
        gender: user.user_metadata?.gender || "",
        bloodGroup: user.user_metadata?.bloodGroup || "",
        avatar: user.user_metadata?.avatar || "",
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      await authAPI.updateProfile({
        name: data.name,
        phone: data.phone,
        address: data.address,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        avatar: data.avatar,
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
      // Trigger reload to update global navbar state
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleAvatarSelect = (url: string) => {
    profileForm.setValue("avatar", url, { shouldDirty: true });
    setIsAvatarDialogOpen(false);
    toast.success("Avatar selected");
  };

  const handleCustomUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      profileForm.setValue("avatar", objectUrl, { shouldDirty: true });
      setIsAvatarDialogOpen(false);
      toast.success("Custom avatar uploaded");
    }
  };

  const userInitials = user?.user_metadata?.name
    ? user.user_metadata.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "JD";

  const currentAvatar = profileForm.watch("avatar");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription className="mt-1">
                Update your personal details and contact information
              </CardDescription>
            </div>
            
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                variant="outline"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  setIsEditing(false);
                  profileForm.reset();
                }}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel Editing
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Profile Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-4 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative group z-10">
              <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                <AvatarImage src={currentAvatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email}`} />
                <AvatarFallback className="text-2xl bg-primary text-white">{userInitials}</AvatarFallback>
              </Avatar>
              
              <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                <DialogTrigger asChild>
                  <button 
                    type="button"
                    className={`absolute bottom-0 right-0 h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-all hover:scale-110 ${!isEditing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    disabled={!isEditing}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Choose Avatar</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-4 gap-4 py-4">
                    {PREDEFINED_AVATARS.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => handleAvatarSelect(url)}
                        className={`relative rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${currentAvatar === url ? 'border-primary shadow-lg scale-105' : 'border-transparent hover:border-slate-200'}`}
                      >
                        <img src={url} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 pt-2 border-t mt-2">
                    <p className="text-sm text-center text-muted-foreground">Or upload your own</p>
                    <Button variant="outline" onClick={handleCustomUploadClick} className="w-full">
                      Upload Image
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*" 
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="text-center sm:text-left z-10 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
                <h3 className="text-xl font-bold text-gray-900">{user?.user_metadata?.name || "User Name"}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 self-center sm:self-auto">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "January 2024"}
              </p>
              
              {isEditing && (
                <p className="text-xs text-primary font-medium mt-3 bg-primary/10 inline-block px-3 py-1 rounded-full animate-pulse">
                  Editing Profile...
                </p>
              )}
            </div>
          </div>

          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <fieldset disabled={!isEditing} className="space-y-6 group-disabled:opacity-80 transition-opacity">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                          <User className="h-4 w-4 text-muted-foreground" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-white/50 backdrop-blur-sm border-slate-200 focus:border-primary focus:ring-primary/20 h-11 rounded-xl transition-all disabled:opacity-70 disabled:bg-slate-50"
                          />
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
                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            {...field} 
                            disabled // Email always disabled for now
                            className="bg-slate-50 backdrop-blur-sm border-slate-200 text-muted-foreground h-11 rounded-xl opacity-80 cursor-not-allowed"
                          />
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
                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            {...field} 
                            className="bg-white/50 backdrop-blur-sm border-slate-200 focus:border-primary focus:ring-primary/20 h-11 rounded-xl transition-all disabled:opacity-70 disabled:bg-slate-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          Address
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-white/50 backdrop-blur-sm border-slate-200 focus:border-primary focus:ring-primary/20 h-11 rounded-xl transition-all disabled:opacity-70 disabled:bg-slate-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          Gender
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                          disabled={!isEditing}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/50 backdrop-blur-sm border-slate-200 focus:border-primary focus:ring-primary/20 h-11 rounded-xl transition-all disabled:opacity-70 disabled:bg-slate-50">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                          <Droplet className="h-4 w-4 text-muted-foreground" />
                          Blood Group
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                          disabled={!isEditing}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/50 backdrop-blur-sm border-slate-200 focus:border-primary focus:ring-primary/20 h-11 rounded-xl transition-all disabled:opacity-70 disabled:bg-slate-50">
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

              <AnimatePresence>
                {isEditing && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-end pt-4 border-t border-slate-100 gap-3"
                  >
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        profileForm.reset();
                      }}
                      className="h-11 px-6 rounded-xl transition-all hover:bg-slate-100"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={profileForm.formState.isSubmitting}
                      className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {profileForm.formState.isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileInformationTab;


