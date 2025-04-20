
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { authAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";

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
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
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

      toast.success("Account created successfully! Welcome to Ekitsa.");

      // Navigate based on user role
      if (response.role === "lab_owner") {
        navigate("/lab-dashboard");
      } else {
        navigate("/profile");
      }
    } catch (error: unknown) {
      console.error("Sign up error:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response &&
        typeof (error as any).response === "object" &&
        "data" in (error as any).response &&
        (error as any).response.data &&
        typeof (error as any).response.data === "object" &&
        "message" in (error as any).response.data
      ) {
        setError((error as any).response.data.message || "Registration failed. Please try again.");
        toast.error((error as any).response.data.message || "Registration failed. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mt-6">Create your account</h1>
          <p className="text-muted-foreground mt-2">
            Join Ekitsa to book lab tests and doctor appointments
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} aria-invalid={!!form.formState.errors.name} className={form.formState.errors.name ? 'border-red-500 focus:border-red-500 ring-red-300' : ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} aria-invalid={!!form.formState.errors.email} className={form.formState.errors.email ? 'border-red-500 focus:border-red-500 ring-red-300' : ''} />
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
                        <Input type="tel" placeholder="9876543210" {...field} aria-invalid={!!form.formState.errors.phone} className={form.formState.errors.phone ? 'border-red-500 focus:border-red-500 ring-red-300' : ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>I am registering as a</FormLabel>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                        aria-label="Select your role"
                      >
                        <div
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer border transition-colors ${field.value === 'user' ? 'border-primary bg-primary/10' : 'border-gray-300'
                            }`}
                          onClick={() => field.onChange('user')}
                          tabIndex={0}
                          role="radio"
                          aria-checked={field.value === 'user'}
                        >
                          <RadioGroupItem value="user" id="user" />
                          <FormLabel htmlFor="user" className="font-normal">
                            Patient / User
                          </FormLabel>
                        </div>
                        <div
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer border transition-colors ${field.value === 'lab_owner' ? 'border-primary bg-primary/10' : 'border-gray-300'
                            }`}
                          onClick={() => field.onChange('lab_owner')}
                          tabIndex={0}
                          role="radio"
                          aria-checked={field.value === 'lab_owner'}
                        >
                          <RadioGroupItem value="lab_owner" id="lab_owner" />
                          <FormLabel htmlFor="lab_owner" className="font-normal">
                            Lab Owner
                          </FormLabel>
                        </div>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        {...form.register('password')}
                        aria-describedby="password-helper"
                        aria-invalid={!!form.formState.errors.password}
                        className={form.formState.errors.password ? 'border-red-500 focus:border-red-500 ring-red-300' : ''}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <p id="password-helper" className="text-xs text-muted-foreground mt-1">
                      Password must be at least 8 characters.
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        {...form.register('confirmPassword')}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>

                <Button
                  type="submit"
                  className="w-full mt-6 font-semibold text-base py-2 transition-transform duration-100 active:scale-95"
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing up...
                    </span>
                  ) : (
                    <>
                      Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
export default SignUp;
