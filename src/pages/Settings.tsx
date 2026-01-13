import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  Link2, 
  Trash2, 
  Mail, 
  Smartphone, 
  MessageSquare,
  Tag,
  Eye,
  UserX,
  Settings2,
  ChevronRight,
  Check
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/services/api";
import { useTranslation } from "react-i18next";

// Helper to get stored settings
const getStoredSettings = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const Settings = () => {
  const navigate = useNavigate();
  
  // Notification settings state - persisted to localStorage
  const [notifications, setNotifications] = useState(() => 
    getStoredSettings("ekitsa_notifications", {
      email: true,
      sms: false,
      push: true,
      promotional: false,
    })
  );

  // Appearance settings state
  const [theme, setTheme] = useState(() => 
    getStoredSettings("ekitsa_theme", "system")
  );
  const [language, setLanguage] = useState(() => 
    getStoredSettings("ekitsa_language", "en")
  );

  // Privacy settings state
  const [privacy, setPrivacy] = useState(() => 
    getStoredSettings("ekitsa_privacy", {
      dataSharing: false,
      profileVisibility: "public",
      marketingEmails: false,
    })
  );

  // Apply theme on mount and when it changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    localStorage.setItem("ekitsa_theme", JSON.stringify(theme));
  }, [theme]);

  // Persist notification settings
  useEffect(() => {
    localStorage.setItem("ekitsa_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Persist privacy settings
  useEffect(() => {
    localStorage.setItem("ekitsa_privacy", JSON.stringify(privacy));
  }, [privacy]);

  // Persist language
  useEffect(() => {
    localStorage.setItem("ekitsa_language", JSON.stringify(language));
  }, [language]);

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Notification settings saved");
  };

  const handlePrivacyChange = (key: keyof typeof privacy, value?: any) => {
    setPrivacy(prev => ({ ...prev, [key]: value !== undefined ? value : !prev[key] }));
    toast.success("Privacy settings saved");
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const { i18n, t } = useTranslation();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    toast.success("Language preference saved");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // In a real app, this would call an API to delete the account
        await authAPI.logout();
        localStorage.clear();
        toast.success("Account deleted successfully");
        navigate("/");
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="fixed left-0 top-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="fixed right-0 bottom-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <main className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Settings2 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t('settings.title')}</h1>
            </div>
            <p className="text-muted-foreground">{t('settings.subtitle')}</p>
          </motion.div>

          {/* Settings Tabs */}
          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-md border border-gray-200/50 p-1 rounded-xl shadow-sm">
              <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary transition-all">
                <Bell className="h-4 w-4 mr-2" />
                {t('settings.notifications.title')}
              </TabsTrigger>
              {/* <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary transition-all">
                <Moon className="h-4 w-4 mr-2" />
                {t('settings.appearance.title')}
              </TabsTrigger> */}
              <TabsTrigger value="privacy" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary transition-all">
                <Shield className="h-4 w-4 mr-2" />
                {t('settings.privacy.title')}
              </TabsTrigger>
              <TabsTrigger value="account" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary transition-all">
                <Link2 className="h-4 w-4 mr-2" />
                {t('settings.account.title')}
              </TabsTrigger>
            </TabsList>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      {t('settings.notifications.preferences')}
                    </CardTitle>
                    <CardDescription>{t('settings.notifications.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <Label className="text-base font-medium">{t('settings.notifications.email')}</Label>
                          <p className="text-sm text-muted-foreground">{t('settings.notifications.emailDesc')}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications.email} 
                        onCheckedChange={() => handleNotificationChange("email")} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Smartphone className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <Label className="text-base font-medium">{t('settings.notifications.sms')}</Label>
                          <p className="text-sm text-muted-foreground">{t('settings.notifications.smsDesc')}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications.sms} 
                        onCheckedChange={() => handleNotificationChange("sms")} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <MessageSquare className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <Label className="text-base font-medium">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive real-time browser notifications</p>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications.push} 
                        onCheckedChange={() => handleNotificationChange("push")} 
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Tag className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <Label className="text-base font-medium">Promotional Emails</Label>
                          <p className="text-sm text-muted-foreground">Receive offers, discounts, and health tips</p>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications.promotional} 
                        onCheckedChange={() => handleNotificationChange("promotional")} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* <TabsContent value="appearance">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Moon className="h-5 w-5 text-primary" />
                      Theme Settings
                    </CardTitle>
                    <CardDescription>Customize the appearance of the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: "light", label: "Light", icon: Sun },
                        { id: "dark", label: "Dark", icon: Moon },
                        { id: "system", label: "System", icon: Settings2 },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleThemeChange(option.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                            theme === option.id 
                              ? "border-primary bg-primary/5 shadow-lg" 
                              : "border-gray-200 bg-white hover:border-primary/50"
                          }`}
                        >
                          {theme === option.id && (
                            <div className="absolute top-2 right-2">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <option.icon className={`h-8 w-8 mx-auto mb-2 ${theme === option.id ? "text-primary" : "text-gray-500"}`} />
                          <p className="font-medium text-center">{option.label}</p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Language & Region
                    </CardTitle>
                    <CardDescription>Set your preferred language</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Display Language</Label>
                        <p className="text-sm text-muted-foreground">Choose the language for the interface</p>
                      </div>
                      <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                          <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                          <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                          <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                          <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent> */}

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Privacy & Security
                    </CardTitle>
                    <CardDescription>Control your data and privacy preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Eye className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <Label className="text-base font-medium">Profile Visibility</Label>
                          <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                        </div>
                      </div>
                      <Select 
                        value={privacy.profileVisibility} 
                        onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="doctors">Doctors Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Link2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <Label className="text-base font-medium">Data Sharing</Label>
                          <p className="text-sm text-muted-foreground">Share anonymized data to improve services</p>
                        </div>
                      </div>
                      <Switch 
                        checked={privacy.dataSharing} 
                        onCheckedChange={() => handlePrivacyChange("dataSharing")} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Mail className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <Label className="text-base font-medium">Marketing Communications</Label>
                          <p className="text-sm text-muted-foreground">Receive marketing and promotional content</p>
                        </div>
                      </div>
                      <Switch 
                        checked={privacy.marketingEmails} 
                        onCheckedChange={() => handlePrivacyChange("marketingEmails")} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link2 className="h-5 w-5 text-primary" />
                      Connected Accounts
                    </CardTitle>
                    <CardDescription>Manage your linked services and accounts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="h-8 w-8" />
                        <div>
                          <Label className="text-base font-medium">Google</Label>
                          <p className="text-sm text-muted-foreground">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="bg-red-50/50 backdrop-blur-md border-red-200/50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <Trash2 className="h-5 w-5" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription className="text-red-600/80">Irreversible and destructive actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-red-100/50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-200 rounded-lg">
                          <UserX className="h-5 w-5 text-red-700" />
                        </div>
                        <div>
                          <Label className="text-base font-medium text-red-800">Delete Account</Label>
                          <p className="text-sm text-red-600/80">Permanently delete your account and all data</p>
                        </div>
                      </div>
                      <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
