import React, { useState } from "react";
import {
  Settings, User, Shield, Save, Check, Eye, EyeOff,
  LogOut, ChevronRight, AlertTriangle, Loader2, Mail,
  Phone, FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setCredentials, logout as logoutAction } from "@/store/slices/authSlice";
import { authAPI } from "@/services/api";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: <User size={16} /> },
  { id: "security", label: "Security", icon: <Shield size={16} /> },
  { id: "danger", label: "Danger Zone", icon: <AlertTriangle size={16} /> },
];

// Strength indicator helpers
const getPasswordStrength = (pwd: string) => {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-400" };
  if (score <= 3) return { score, label: "Fair", color: "bg-amber-400" };
  if (score === 4) return { score, label: "Good", color: "bg-blue-500" };
  return { score, label: "Strong", color: "bg-green-500" };
};

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [active, setActive] = useState("profile");

  // --- Profile section ---
  const [name, setName] = useState(user?.name || "Lab Admin");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // --- Security section ---
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);

  const pwdStrength = getPasswordStrength(newPwd);
  const pwdMatch = confirmPwd.length > 0 && newPwd === confirmPwd;
  const pwdMismatch = confirmPwd.length > 0 && newPwd !== confirmPwd;

  // --- Handlers ---
  const handleProfileSave = async () => {
    if (!name.trim() || name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }

    setProfileSaving(true);
    try {
      const { data } = await authAPI.updateProfile({ name: name.trim(), phone, bio });
      // Update Redux store so header/avatar reflects the change immediately
      dispatch(setCredentials({ user: { ...user, name: name.trim(), phone, bio }, role: user?.role || "lab_owner" }));
      // Update localStorage
      localStorage.setItem("userData", JSON.stringify({ ...user, name: name.trim(), phone, bio }));
      setProfileSaved(true);
      toast.success("Profile updated successfully");
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPwd) {
      toast.error("Enter a new password");
      return;
    }
    if (newPwd.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (pwdStrength.score < 2) {
      toast.error("Password is too weak. Add numbers, capitals, or symbols.");
      return;
    }
    if (newPwd !== confirmPwd) {
      toast.error("Passwords do not match");
      return;
    }

    setPwdSaving(true);
    try {
      await authAPI.updatePassword(newPwd);
      toast.success("Password changed successfully. Use your new password next time you log in.");
      setNewPwd("");
      setConfirmPwd("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to change password. Please try again.");
    } finally {
      setPwdSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authAPI.logout(); // This clears localStorage and redirects
    } catch {
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="text-primary" size={24} />
          Settings
        </h2>
        <p className="text-slate-500 mt-1">Manage your account profile and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <Card className="border-slate-200/60 shadow-sm rounded-2xl h-fit">
          <CardContent className="p-3">
            <nav className="space-y-1">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active === s.id
                      ? s.id === "danger"
                        ? "bg-red-500 text-white shadow-sm"
                        : "bg-primary text-white shadow-sm"
                      : s.id === "danger"
                      ? "text-red-600 hover:bg-red-50"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className={
                    active === s.id ? "text-white" :
                    s.id === "danger" ? "text-red-400" : "text-slate-400"
                  }>
                    {s.icon}
                  </span>
                  {s.label}
                  {active === s.id && <ChevronRight size={14} className="ml-auto" />}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content panel */}
        <div className="lg:col-span-3 space-y-4">

          {/* ── PROFILE ── */}
          {active === "profile" && (
            <Card className="border-slate-200/60 shadow-sm rounded-2xl">
              <CardHeader className="border-b border-slate-100 px-6 py-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <User size={16} className="text-primary" /> Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Avatar / name block */}
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-extrabold text-2xl border-2 border-primary/20 flex-shrink-0">
                    {name[0]?.toUpperCase() || "L"}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{name || "Lab Admin"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{user?.email || "—"}</p>
                    <Badge className="mt-1.5 text-[10px] bg-primary/10 text-primary border-0 font-semibold">
                      Lab Owner
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Editable fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <User size={13} className="text-slate-400" /> Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your full name"
                      className="h-11 rounded-xl border-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Mail size={13} className="text-slate-400" /> Email Address
                    </Label>
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                    />
                    <p className="text-[11px] text-slate-400">Email cannot be changed here. Contact support if needed.</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Phone size={13} className="text-slate-400" /> Phone Number
                    </Label>
                    <Input
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      maxLength={10}
                      className="h-11 rounded-xl border-slate-200"
                    />
                    <p className="text-[11px] text-slate-400">10-digit Indian mobile number, no spaces.</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <FileText size={13} className="text-slate-400" /> Bio
                    <span className="text-slate-400 font-normal text-xs">(optional)</span>
                  </Label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    maxLength={300}
                    placeholder="Briefly describe yourself or your lab group..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                  />
                  <p className={`text-[11px] text-right ${bio.length > 280 ? "text-amber-500" : "text-slate-400"}`}>
                    {bio.length}/300
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleProfileSave}
                    disabled={profileSaving}
                    className="gap-2 rounded-xl shadow-lg shadow-primary/20 min-w-[140px]"
                  >
                    {profileSaving ? (
                      <><Loader2 size={15} className="animate-spin" /> Saving...</>
                    ) : profileSaved ? (
                      <><Check size={15} /> Saved!</>
                    ) : (
                      <><Save size={15} /> Save Profile</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── SECURITY ── */}
          {active === "security" && (
            <Card className="border-slate-200/60 shadow-sm rounded-2xl">
              <CardHeader className="border-b border-slate-100 px-6 py-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Shield size={16} className="text-primary" /> Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 leading-relaxed">
                  You're logged in as <span className="font-bold">{user?.email}</span>. To change your password, set a new one below — no need to enter your current password.
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <Label className="font-semibold text-slate-700">
                    New Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showNewPwd ? "text" : "password"}
                      value={newPwd}
                      onChange={e => setNewPwd(e.target.value)}
                      placeholder="Enter new password"
                      className="h-11 rounded-xl pr-10 border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {newPwd.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              i <= pwdStrength.score ? pwdStrength.color : "bg-slate-100"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-[11px] font-semibold ${
                        pwdStrength.score <= 1 ? "text-red-500" :
                        pwdStrength.score <= 3 ? "text-amber-600" :
                        "text-green-600"
                      }`}>
                        {pwdStrength.label}
                      </p>
                    </div>
                  )}

                  <ul className="text-[11px] text-slate-400 space-y-0.5 mt-1">
                    <li className={newPwd.length >= 8 ? "text-green-600" : ""}>• At least 8 characters</li>
                    <li className={/[A-Z]/.test(newPwd) ? "text-green-600" : ""}>• At least one uppercase letter</li>
                    <li className={/\d/.test(newPwd) ? "text-green-600" : ""}>• At least one number</li>
                    <li className={/[^A-Za-z0-9]/.test(newPwd) ? "text-green-600" : ""}>• At least one symbol (!@#$…)</li>
                  </ul>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label className="font-semibold text-slate-700">
                    Confirm New Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPwd ? "text" : "password"}
                      value={confirmPwd}
                      onChange={e => setConfirmPwd(e.target.value)}
                      placeholder="Re-enter new password"
                      className={`h-11 rounded-xl pr-10 border-slate-200 ${
                        pwdMatch ? "border-green-400 focus-visible:ring-green-200" :
                        pwdMismatch ? "border-red-400 focus-visible:ring-red-200" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {pwdMatch && (
                    <p className="text-[11px] text-green-600 flex items-center gap-1">
                      <Check size={11} /> Passwords match
                    </p>
                  )}
                  {pwdMismatch && (
                    <p className="text-[11px] text-red-500">Passwords do not match</p>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handlePasswordChange}
                    disabled={pwdSaving || !newPwd || !confirmPwd}
                    className="gap-2 rounded-xl shadow-lg shadow-primary/20 min-w-[160px]"
                  >
                    {pwdSaving ? (
                      <><Loader2 size={15} className="animate-spin" /> Updating...</>
                    ) : (
                      <><Shield size={15} /> Update Password</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── DANGER ZONE ── */}
          {active === "danger" && (
            <div className="space-y-4">
              {/* Sign Out */}
              <Card className="border-slate-200/60 shadow-sm rounded-2xl">
                <CardContent className="p-6 flex items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <LogOut size={16} className="text-slate-600" />
                      <p className="font-semibold text-slate-900">Sign Out</p>
                    </div>
                    <p className="text-sm text-slate-500">
                      Sign out of your account on this device. You can sign back in at any time.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="rounded-xl flex-shrink-0 gap-2 border-slate-200">
                        <LogOut size={15} /> Sign Out
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Sign out of your account?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You will be redirected to the login page. Any unsaved changes will be lost.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="rounded-xl bg-slate-900 hover:bg-slate-800"
                          onClick={handleSignOut}
                        >
                          Yes, sign me out
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>

              {/* Delete Account */}
              <Card className="border-red-100 bg-red-50/30 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle size={18} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 mb-1">Delete Account</p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Permanently delete your Ekitsa Lab Owner account. This will remove all your labs, tests, bookings, and data from our platform. <strong className="text-red-600">This action cannot be undone.</strong>
                      </p>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl gap-2"
                      >
                        <AlertTriangle size={14} /> Delete My Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                          <AlertTriangle size={18} /> Delete your account?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <p>This will permanently delete:</p>
                          <ul className="list-disc list-inside text-sm space-y-0.5 text-slate-600">
                            <li>Your lab owner profile</li>
                            <li>All registered labs and their tests</li>
                            <li>All booking history and reports</li>
                            <li>All billing records</li>
                          </ul>
                          <p className="text-red-600 font-semibold mt-3">This action is irreversible.</p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => {
                            toast.info("Account deletion request received. Our team will process it within 7 business days and send you a confirmation email.");
                          }}
                        >
                          I understand, delete my account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
