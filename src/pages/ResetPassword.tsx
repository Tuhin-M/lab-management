import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Shield, Clock, Home, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authAPI } from "@/services/api";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = form.watch("password") || "";

  // Check if session or recovery token exists
  useEffect(() => {
    const checkRecoverySession = async () => {
      // Check if URL has hash tokens (#access_token=...&type=recovery)
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        setHasValidSession(true);
        return;
      }

      // Check active auth session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasValidSession(true);
      } else {
        // Wait briefly for Supabase to parse the URL hash
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "PASSWORD_RECOVERY" || session) {
            setHasValidSession(true);
          }
        });
        setTimeout(() => {
          if (hasValidSession === null) setHasValidSession(true); // Allow entry with fallback
        }, 1500);

        return () => subscription.unsubscribe();
      }
    };

    checkRecoverySession();
  }, []);

  const handleResetPassword = async (values: ResetPasswordValues) => {
    try {
      setIsLoading(true);
      await authAPI.updatePassword(values.password);
      setIsSuccess(true);
      toast.success("Password updated successfully!");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Failed to update password. Your reset link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = {
    hasMinLength: watchPassword.length >= 8,
    hasNumber: /\d/.test(watchPassword),
    hasLetter: /[a-zA-Z]/.test(watchPassword),
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Dark Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=2000')" }}
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-20 w-72 h-72 bg-primary/30 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]" 
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/" className="mb-12 block">
              <img src="/images/ekitsa_logo.png" alt="Ekitsa Logo" className="h-20 w-auto" />
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Create New
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary">
                Secure Password
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg mb-10 max-w-md">
              Safeguard your healthcare data with an updated, robust password. Ensure it meets the security guidelines.
            </p>
            
            {/* Trust Badges */}
            <div className="space-y-4">
              {[
                { icon: Shield, label: "Encrypted Credential Storage" },
                { icon: Clock, label: "Immediate Account Synchronization" },
                { icon: Home, label: "Automatic Protection Across All Devices" },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50/50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-block">
              <img src="/images/ekitsa_logo.png" alt="Ekitsa Logo" className="h-14 w-auto mx-auto" />
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50"
              >
                <div className="mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Reset Your Password
                  </h2>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    Please choose a strong password that you haven't used before.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-5">
                    {/* New Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold text-xs uppercase tracking-wider">
                            New Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                autoComplete="new-password"
                                className={`h-12 bg-slate-50/80 border-slate-200 rounded-xl focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all pr-12 ${
                                  fieldState.invalid ? "border-red-500" : ""
                                }`}
                              />
                              <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none transition-colors"
                                onClick={() => setShowPassword((v) => !v)}
                                tabIndex={-1}
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold text-xs uppercase tracking-wider">
                            Confirm New Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Re-enter new password"
                                autoComplete="new-password"
                                className={`h-12 bg-slate-50/80 border-slate-200 rounded-xl focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all pr-12 ${
                                  fieldState.invalid ? "border-red-500" : ""
                                }`}
                              />
                              <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none transition-colors"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                tabIndex={-1}
                              >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Requirements checklist */}
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            passwordValidation.hasMinLength
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          ✓
                        </div>
                        <span className={passwordValidation.hasMinLength ? "text-emerald-700 font-medium" : ""}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            passwordValidation.hasNumber
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          ✓
                        </div>
                        <span className={passwordValidation.hasNumber ? "text-emerald-700 font-medium" : ""}>
                          Contains at least one number
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          Set New Password <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                  Password Updated!
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto mb-6">
                  Your password has been securely reset. You can now log in with your updated credentials.
                </p>

                <Button
                  onClick={() => navigate("/login")}
                  className="w-full h-12 rounded-xl font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 gap-2"
                >
                  Sign In Now <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
