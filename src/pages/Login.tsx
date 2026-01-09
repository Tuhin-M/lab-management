import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, Sparkles, ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { authAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
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

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authAPI.login(values.email, values.password);

      if (response) {
        dispatch(setCredentials({ user: response.user, role: response.role }));

        // Redirect based on role
        if (response.role === 'lab_owner') {
          navigate('/lab-dashboard');
        } else {
          navigate('/profile');
        }
        toast.success('Successfully logged in!');
      }

    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Invalid email or password');
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-4 overflow-hidden bg-slate-50/50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 opacity-50"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
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
            Welcome back
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mt-2 text-lg"
          >
            Log in to continue with Ekitsa
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
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          className={`bg-white/50 backdrop-blur-sm border-slate-200 focus:border-primary focus:ring-primary/20 transition-all ${fieldState.invalid ? "border-red-500 focus:border-red-500" : ""}`}
                          aria-invalid={fieldState.invalid}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-foreground/80">Password</FormLabel>
                        <Link to="#" className="text-xs text-primary hover:underline font-medium">
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className={`bg-white/50 backdrop-blur-sm border-slate-200 focus:border-primary focus:ring-primary/20 transition-all pr-10 ${fieldState.invalid ? "border-red-500 focus:border-red-500" : ""}`}
                            aria-invalid={fieldState.invalid}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none transition-colors"
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

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          id="rememberMe" 
                          className="data-[state=checked]:bg-primary border-slate-300"
                        />
                      </FormControl>
                      <FormLabel htmlFor="rememberMe" className="font-normal cursor-pointer text-muted-foreground select-none">Remember me</FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full font-semibold text-base py-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                       <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                       Logging in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Log In <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center bg-slate-50/50 border-t border-slate-100 py-6 relative z-10">
            <span className="text-sm text-muted-foreground">Don&apos;t have an account?</span>
            <Link to="/signup" className="ml-2 text-primary font-semibold hover:underline">Sign up</Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
