import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, Shield, Smartphone, Eye, KeyRound, LogOut, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

import { authAPI } from "@/services/api";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const SecurityTab = () => {
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      await authAPI.updatePassword(data.newPassword);
      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "Failed to update password");
    }
  };

  const securityOptions = [
    {
      icon: Smartphone,
      title: "Two-factor authentication",
      description: "Add an extra layer of security to your account",
      enabled: false,
      action: "Enable"
    },
    {
      icon: Eye,
      title: "Login alerts",
      description: "Get notified when someone logs into your account",
      enabled: true,
      action: "Manage"
    },
  ];

  const sessions = [
    {
      device: "Chrome on Windows",
      location: "Bangalore, India",
      time: "Active now",
      current: true
    },
    {
      device: "Safari on iPhone",
      location: "Mumbai, India",
      time: "2 days ago",
      current: false
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Change Password Card */}
      <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-xl flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        className="bg-white/50 backdrop-blur-sm border-slate-200 focus:border-primary focus:ring-primary/20 h-11 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          {...field} 
                          className="bg-white/50 backdrop-blur-sm border-slate-200 focus:border-primary focus:ring-primary/20 h-11 rounded-xl"
                        />
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
                      <FormLabel className="text-sm font-medium">Confirm New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          {...field} 
                          className="bg-white/50 backdrop-blur-sm border-slate-200 focus:border-primary focus:ring-primary/20 h-11 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  type="submit" 
                  className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105"
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Security Settings Card */}
      <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {securityOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <option.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
              <Switch checked={option.enabled} />
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Active Sessions Card */}
      <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Manage your active login sessions
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          {sessions.map((session, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl ${session.current ? 'bg-green-50 border border-green-200' : 'bg-slate-50/50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${session.current ? 'bg-green-100' : 'bg-slate-100'}`}>
                  <Smartphone className={`h-5 w-5 ${session.current ? 'text-green-600' : 'text-slate-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    {session.device}
                    {session.current && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Current</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{session.location} • {session.time}</p>
                </div>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 rounded-xl">
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-50/50 backdrop-blur-md border-red-200/50 shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-600/80">
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/60">
            <div>
              <p className="font-medium text-red-700">Delete Account</p>
              <p className="text-sm text-red-600/70">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive" size="sm" className="rounded-xl">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SecurityTab;
