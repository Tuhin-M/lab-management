import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { authAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    if (authAPI.isAuthenticated()) {
      const userRole = authAPI.getCurrentUserRole();
      if (userRole === "lab_owner") {
        navigate("/lab-dashboard");
      } else {
        navigate("/profile");
      }
    }
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
      
      // Store token based on remember me choice
      if (values.rememberMe) {
        localStorage.setItem('token', response.token);
      } else {
        sessionStorage.setItem('token', response.token);
      }
      
      // Redirect based on role
      const userRole = authAPI.getCurrentUserRole();
      if (userRole === 'lab_owner') {
        navigate('/lab-dashboard');
      } else {
        navigate('/profile');
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid email or password');
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mt-6">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Log in to continue with Ekitsa
          </p>
        </div>

        <Card className="shadow-lg border-2 border-primary/10">
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm animate-shake" role="alert">
                <span className="font-semibold">Error:</span> {error}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          className={fieldState.invalid ? "border-red-500 focus:border-red-500" : ""}
                          aria-invalid={fieldState.invalid}
                          aria-describedby="email-error"
                        />
                      </FormControl>
                      <FormMessage id="email-error" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className={fieldState.invalid ? "border-red-500 focus:border-red-500 pr-10" : "pr-10"}
                            aria-invalid={fieldState.invalid}
                            aria-describedby="password-error"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none"
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <div className="text-xs text-muted-foreground mt-1">Password is case sensitive.</div>
                      <FormMessage id="password-error" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} id="rememberMe" />
                      </FormControl>
                      <FormLabel htmlFor="rememberMe" className="font-normal cursor-pointer">Remember me</FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full font-semibold text-base py-2 transition-transform duration-100 active:scale-95"
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <LogIn className="animate-spin h-5 w-5" /> Logging in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <LogIn className="h-5 w-5" /> Log In
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center bg-muted rounded-b-lg py-4">
            <span className="text-sm text-muted-foreground">Don&apos;t have an account?</span>
            <Link to="/signup" className="ml-2 text-primary font-medium hover:underline">Sign up</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
