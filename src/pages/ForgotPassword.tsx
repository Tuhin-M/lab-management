import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  ArrowRight, 
  Shield, 
  Lock, 
  Mail, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  KeyRound,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authAPI } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

const forgotPasswordSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordValue = form.watch("password") || "";
  const confirmPasswordValue = form.watch("confirmPassword") || "";

  const hasMinLength = passwordValue.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue);
  const passwordsMatch = passwordValue.length > 0 && passwordValue === confirmPasswordValue;

  const handleResetPassword = async (values: ForgotPasswordValues) => {
    try {
      setIsLoading(true);
      await authAPI.resetPasswordDirect(values.email, values.password);
      setSubmittedEmail(values.email);
      setIsSubmitted(true);
      toast.success("Password reset successfully! You can now log in with your new password.");
    } catch (error: any) {
      console.error("Direct password reset failed:", error);
      toast.error(error.message || "Failed to update password. Please verify your email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAnother = () => {
    form.reset({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setIsSubmitted(false);
    setSubmittedEmail("");
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
              Direct Password Reset
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary">
                Instant & Secure
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg mb-10 max-w-md">
              Update your account credentials immediately. Enter your registered email and choose a strong new password to regain access without waiting for external reset links.
            </p>
            
            {/* Trust Badges */}
            <div className="space-y-4">
              {[
                { icon: KeyRound, label: "Direct Password Update (No link required)" },
                { icon: Shield, label: "SHA-256 Encrypted Credential Protection" },
                { icon: Sparkles, label: "Instant Access to Patient & Lab Portals" },
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
            {!isSubmitted ? (
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
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Reset Your Password
                  </h2>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    Enter your registered email address and create a new password to instantly update your account credentials.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-4">
                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold text-xs uppercase tracking-wider">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="name@example.com"
                                autoComplete="email"
                                className={`h-11 pl-10 bg-slate-50/80 border-slate-200 rounded-xl focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all ${
                                  fieldState.invalid ? "border-red-500" : ""
                                }`}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* New Password Field */}
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
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="At least 8 characters"
                                autoComplete="new-password"
                                className={`h-11 pl-10 pr-10 bg-slate-50/80 border-slate-200 rounded-xl focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all ${
                                  fieldState.invalid ? "border-red-500" : ""
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password Field */}
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
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Re-enter your new password"
                                autoComplete="new-password"
                                className={`h-11 pl-10 pr-10 bg-slate-50/80 border-slate-200 rounded-xl focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all ${
                                  fieldState.invalid ? "border-red-500" : ""
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Strength and Match Indicators */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs space-y-1.5 text-slate-500">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                            hasMinLength
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 text-slate-400"
                          }`}
                        >
                          {hasMinLength ? <Check className="w-2.5 h-2.5" /> : null}
                        </div>
                        <span className={hasMinLength ? "text-emerald-700 font-medium" : ""}>
                          Minimum 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                            hasNumberOrSymbol
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 text-slate-400"
                          }`}
                        >
                          {hasNumberOrSymbol ? <Check className="w-2.5 h-2.5" /> : null}
                        </div>
                        <span className={hasNumberOrSymbol ? "text-emerald-700 font-medium" : ""}>
                          Contains a number or special character
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                            passwordsMatch
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 text-slate-400"
                          }`}
                        >
                          {passwordsMatch ? <Check className="w-2.5 h-2.5" /> : null}
                        </div>
                        <span className={passwordsMatch ? "text-emerald-700 font-medium" : ""}>
                          Passwords match
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all gap-2 mt-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          Reset Password <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Sign In
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="confirmation"
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
                  Password Reset Successful!
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto mb-4">
                  Your password for this account has been securely updated:
                </p>
                <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm text-slate-900 mb-6 inline-block max-w-full truncate">
                  {submittedEmail}
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-left text-xs text-emerald-900 space-y-1 mb-6">
                  <p className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Direct Reset Activated
                  </p>
                  <p className="text-emerald-800">
                    No reset link was required. Your new password is now active and ready to use immediately.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => navigate("/login", { state: { email: submittedEmail } })}
                    className="w-full h-12 rounded-xl font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 gap-2"
                  >
                    Sign In with New Password <ArrowRight className="w-4 h-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetAnother}
                    className="w-full h-11 rounded-xl font-semibold text-xs gap-2 border-slate-200 hover:bg-slate-50 text-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset for Another Account
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
