import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, User, FlaskConical, Sparkles, CheckCircle2 } from "lucide-react";
import { authAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { motion } from "framer-motion";

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  role: z.enum(["user", "lab_owner"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (await authAPI.isAuthenticated()) {
        const userRole = authAPI.getCurrentUserRole();
        if (userRole === "lab_owner") {
          navigate("/lab-dashboard");
        } else {
          navigate("/profile");
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authAPI.signup({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role
      });

      if (response) {
        dispatch(setCredentials({ user: response.user, role: response.role }));
        toast.success("Account created successfully! Welcome to Ekitsa.");

        // Navigate based on user role
        if (response.role === "lab_owner") {
          navigate("/lab-dashboard");
        } else {
          navigate("/profile");
        }
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      setError(error.message || "Registration failed. Please try again.");
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-4 py-16 overflow-hidden bg-slate-50/50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 opacity-50"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4"
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold tracking-tight"
          >
            Create your account
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mt-2 text-lg"
          >
            Join Ekitsa to book lab tests and manage appointments
          </motion.p>
        </div>

        <Card className="shadow-2xl border-white/20 bg-white/80 backdrop-blur-md overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 pointer-events-none" />
          <CardContent className="pt-8 relative z-10">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 p-4 bg-red-50/50 backdrop-blur-sm border border-red-200 text-red-700 rounded-lg text-sm flex items-center"
                role="alert"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2 flex-shrink-0" />
                <span className="font-semibold mr-1">Error:</span> {error}
              </motion.div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold">I am registering as a</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="user" className="peer sr-only" />
                            </FormControl>
                            <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white/50 backdrop-blur-sm p-4 hover:bg-slate-50 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all cursor-pointer h-full">
                              <User className="mb-3 h-6 w-6 text-primary" />
                              <div className="text-center space-y-1">
                                <span className="block font-semibold">Patient / User</span>
                                <span className="block text-xs text-muted-foreground font-normal">
                                  Book tests & appointments
                                </span>
                              </div>
                              {field.value === 'user' && (
                                <div className="absolute top-2 right-2 text-primary">
                                  <CheckCircle2 className="h-4 w-4" />
                                </div>
                              )}
                            </FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="lab_owner" className="peer sr-only" />
                            </FormControl>
                            <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white/50 backdrop-blur-sm p-4 hover:bg-slate-50 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all cursor-pointer h-full">
                              <FlaskConical className="mb-3 h-6 w-6 text-primary" />
                              <div className="text-center space-y-1">
                                <span className="block font-semibold">Lab Owner</span>
                                <span className="block text-xs text-muted-foreground font-normal">
                                  Manage labs & tests
                                </span>
                              </div>
                              {field.value === 'lab_owner' && (
                                <div className="absolute top-2 right-2 text-primary">
                                  <CheckCircle2 className="h-4 w-4" />
                                </div>
                              )}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-white/50 backdrop-blur-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="9876543210" {...field} className="bg-white/50 backdrop-blur-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} className="bg-white/50 backdrop-blur-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="********"
                              {...field}
                              className="bg-white/50 backdrop-blur-sm pr-10"
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="********"
                              {...field}
                              className="bg-white/50 backdrop-blur-sm pr-10"
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 font-semibold text-base py-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                       <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                       Signing up...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Create Account <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center bg-slate-50/50 border-t border-slate-100 py-6 relative z-10">
            <span className="text-sm text-muted-foreground">Already have an account?</span>
            <Link to="/login" className="ml-2 text-primary font-semibold hover:underline">
              Log in
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};
export default SignUp;
