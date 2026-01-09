import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { TestTube, Calendar as CalendarIcon, MapPin, CreditCard, Clock, User, Home, Building2, CheckCircle, Info, ShieldCheck, Star } from "lucide-react";
import CitySelection from "@/components/CitySelection";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const labData = {
  id: "lab123",
  name: "HealthPlus Diagnostics",
  address: "123 Healthcare Avenue, Koramangala, Bangalore",
  rating: 4.7,
  reviews: 243,
  nabl: true,
  images: ["https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"],
  openHours: "7:00 AM - 8:00 PM",
  daysOpen: "Monday - Sunday",
  homeCollection: true,
  homeCollectionCharges: 100,
};

const testData = {
  id: "test456",
  name: "Complete Blood Count (CBC)",
  description: "A CBC is used to evaluate your overall health and detect a wide range of disorders, including anemia, infection and leukemia.",
  price: 899,
  discountPrice: 599,
  turnaroundTime: "12-24 hours",
  parameters: [
    "RBC Count", "Hemoglobin", "Hematocrit", "WBC Count", 
    "Platelet Count", "MCV", "MCH", "MCHC", "RDW"
  ],
  preparation: "Fasting required for 8 hours before the test. Water consumption is allowed.",
  sampleType: "Blood",
};

const bookingFormSchema = z.object({
  patientName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  patientAge: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 120, {
    message: "Age must be a number between 1 and 120",
  }),
  patientGender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  patientPhone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  patientEmail: z.string().email({ message: "Invalid email address" }).optional(),
  collectionType: z.enum(["home", "lab"], {
    required_error: "Please select a collection type",
  }),
  address: z.string().optional(),
  testDate: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  paymentMethod: z.enum(["online", "cash"], {
    required_error: "Please select a payment method",
  }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const TestBooking = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingFormValues | null>(null);
  
  const timeSlots = [
    "07:00 AM - 08:00 AM", "08:00 AM - 09:00 AM", "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM",
  ];

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      patientName: "",
      patientAge: "",
      patientGender: "male",
      patientPhone: "",
      patientEmail: "",
      collectionType: "lab",
      address: "",
      paymentMethod: "online",
    },
  });

  const collectionType = form.watch("collectionType");

  const onSubmit = (data: BookingFormValues) => {
    console.log("Booking data:", data);
    setBookingDetails(data);
    setIsConfirmationOpen(true);
  };

  const confirmBooking = () => {
    setIsConfirmationOpen(false);
    toast.success("Test booking confirmed! You will receive a confirmation on your phone.");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col pt-16 relative selection:bg-primary/20">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] opacity-60" />
      </div>

      <main className="flex-grow container mx-auto py-8 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Book Your Test</h1>
            <p className="text-muted-foreground">Complete the form below to schedule your appointment</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="bg-white/80 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden rounded-2xl">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/5 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Patient Details</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Who is this booking for?</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="patientName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} className="bg-white/50 backdrop-blur-sm border-gray-200 focus:border-primary/50 focus:ring-primary/20 h-11" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="patientAge"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                  <Input placeholder="35" {...field} className="bg-white/50 backdrop-blur-sm border-gray-200 focus:border-primary/50 focus:ring-primary/20 h-11" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="patientGender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-6"
                                >
                                  {["male", "female", "other"].map((gender) => (
                                    <FormItem key={gender} className="flex items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value={gender} />
                                      </FormControl>
                                      <FormLabel className="font-medium cursor-pointer capitalize">
                                        {gender}
                                      </FormLabel>
                                    </FormItem>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="patientPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="9876543210" {...field} className="bg-white/50 backdrop-blur-sm border-gray-200 focus:border-primary/50 focus:ring-primary/20 h-11" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="patientEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email (Optional)</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="you@example.com" {...field} className="bg-white/50 backdrop-blur-sm border-gray-200 focus:border-primary/50 focus:ring-primary/20 h-11" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-6 pt-6 border-t border-dashed">
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                             <MapPin className="h-5 w-5 text-primary" />
                             Collection Preference
                          </h3>
                        <FormField
                          control={form.control}
                          name="collectionType"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-2 gap-6"
                                >
                                  <FormItem>
                                    <FormControl>
                                      <RadioGroupItem value="lab" className="sr-only peer" />
                                    </FormControl>
                                    <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-slate-50 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 text-center cursor-pointer transition-all shadow-sm">
                                      <Building2 className="mb-3 h-8 w-8 text-gray-400 peer-data-[state=checked]:text-primary" />
                                      <span className="font-bold text-lg">Visit Lab</span>
                                      <span className="text-xs text-muted-foreground mt-1">Visit the lab location for sample collection</span>
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem>
                                    <FormControl>
                                      <RadioGroupItem value="home" className="sr-only peer" />
                                    </FormControl>
                                    <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-slate-50 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 text-center cursor-pointer transition-all shadow-sm relative overflow-hidden">
                                      <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Recommended</div>
                                      <Home className="mb-3 h-8 w-8 text-gray-400 peer-data-[state=checked]:text-primary" />
                                      <span className="font-bold text-lg">Home Collection</span>
                                      <span className="text-xs text-muted-foreground mt-1">Get samples collected at your home (+₹100)</span>
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        </div>

                        {collectionType === "home" && (
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="animate-in fade-in slide-in-from-top-4 duration-300">
                                <FormLabel>Home Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your complete address" {...field} className="bg-white/50 backdrop-blur-sm border-gray-200 focus:border-primary/50 focus:ring-primary/20 h-11" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <div className="grid md:grid-cols-2 gap-8 pt-4">
                          <div>
                            <FormField
                              control={form.control}
                              name="testDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel className="mb-2">Preferred Date</FormLabel>
                                  <FormControl>
                                    <div className="border border-gray-200 rounded-xl bg-white p-2 shadow-sm">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => 
                                          date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))
                                        }
                                        initialFocus
                                        className="rounded-lg"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div>
                            <FormField
                              control={form.control}
                              name="timeSlot"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="mb-2 block">Preferred Time</FormLabel>
                                  <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                                    {timeSlots.map((slot) => (
                                      <div key={slot} className="relative">
                                        <RadioGroup 
                                          value={field.value} 
                                          onValueChange={field.onChange}
                                          className="hidden"
                                        >
                                          <RadioGroupItem value={slot} id={`time-${slot}`} />
                                        </RadioGroup>
                                        <Label 
                                          htmlFor={`time-${slot}`}
                                          className={`flex items-center justify-center text-center rounded-lg border-2 p-3 cursor-pointer text-xs w-full transition-all hover:bg-primary/5 ${field.value === slot ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-gray-100 bg-white'}`}
                                          onClick={() => field.onChange(slot)}
                                        >
                                          {slot}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="pt-6 border-t border-dashed">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                             <CreditCard className="h-5 w-5 text-primary" />
                             Payment Method
                          </h3>
                          
                          <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-2 gap-6"
                                  >
                                    <FormItem>
                                      <FormControl>
                                        <RadioGroupItem value="online" className="sr-only peer" />
                                      </FormControl>
                                      <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-slate-50 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 text-center cursor-pointer transition-all shadow-sm">
                                        <CreditCard className="mb-3 h-6 w-6 text-gray-400 peer-data-[state=checked]:text-primary" />
                                        <span className="font-bold">Online Payment</span>
                                        <span className="text-xs text-center mt-1 text-muted-foreground">UPI, Card, Net Banking</span>
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem>
                                      <FormControl>
                                        <RadioGroupItem value="cash" className="sr-only peer" />
                                      </FormControl>
                                      <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-slate-50 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 text-center cursor-pointer transition-all shadow-sm">
                                        <svg className="mb-3 h-6 w-6 text-gray-400 peer-data-[state=checked]:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="font-bold">Pay on Collection</span>
                                        <span className="text-xs text-center mt-1 text-muted-foreground">Cash/QR at center</span>
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full h-12 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600">
                        Confirm & Pay
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="md:sticky md:top-24 h-fit space-y-6">
              {/* Order Summary Card */}
              <Card className="bg-primary/5 border-primary/20 shadow-lg overflow-hidden rounded-2xl">
                <CardHeader className="bg-primary/10 border-b border-primary/10 pb-4">
                  <CardTitle className="text-primary flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                   <div>
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Selected Test</h4>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-primary/10">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900">{testData.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{testData.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                           <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                             {testData.sampleType}
                           </Badge>
                           <span className="font-bold text-primary">₹{testData.discountPrice}</span>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-3 pt-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Test Price</span>
                        <span>₹{testData.discountPrice}</span>
                      </div>
                      {collectionType === "home" && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Home Collection</span>
                          <span>₹{labData.homeCollectionCharges}</span>
                        </div>
                      )}
                      {collectionType === "home" && (
                         <div className="flex justify-between text-green-600 text-xs">
                           <span>Convenience Fee</span>
                           <span>FREE</span>
                         </div>
                      )}
                      <div className="border-t border-dashed pt-3 mt-2">
                        <div className="flex justify-between items-end">
                          <span className="font-bold text-lg">Total</span>
                          <span className="font-black text-2xl text-primary">₹{testData.discountPrice + (collectionType === "home" ? labData.homeCollectionCharges : 0)}</span>
                        </div>
                      </div>
                   </div>
                </CardContent>
                <CardFooter className="bg-primary/5 border-t border-primary/10 p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span>Safe & Secure Payment</span>
                  </div>
                </CardFooter>
              </Card>

              {/* Lab Info Card */}
              <Card className="bg-white/80 backdrop-blur-md border border-white/20 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                     <div className="h-12 w-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                       <img src={labData.images[0]} alt={labData.name} className="w-full h-full object-cover" />
                     </div>
                     <div>
                       <h4 className="font-bold text-sm">{labData.name}</h4>
                       <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="line-clamp-1">{labData.address}</span>
                       </div>
                       <div className="flex items-center gap-1 mt-2">
                          <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center">
                            <Star className="h-3 w-3 mr-0.5" fill="currentColor" />
                            {labData.rating}
                          </span>
                          <span className="text-[10px] text-muted-foreground">({labData.reviews} reviews)</span>
                       </div>
                     </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {bookingDetails && (
        <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl overflow-hidden border-0 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-cyan-500" />
            <DialogHeader className="pt-6 px-6">
              <div className="mx-auto bg-green-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <DialogTitle className="text-center text-xl">Confirm Booking</DialogTitle>
              <DialogDescription className="text-center">
                Please review your appointment details
              </DialogDescription>
            </DialogHeader>
            
            <div className="px-6 py-2 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Patient</span>
                    <span className="font-semibold">{bookingDetails.patientName}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-semibold">{format(bookingDetails.testDate, "MMM d")} at {bookingDetails.timeSlot.split('-')[0]}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lab</span>
                    <span className="font-semibold truncate max-w-[150px]">{labData.name}</span>
                 </div>
                 <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-bold">Total Amount</span>
                    <span className="font-bold text-lg text-primary">₹{testData.discountPrice + (bookingDetails.collectionType === "home" ? labData.homeCollectionCharges : 0)}</span>
                 </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg text-blue-700">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                  {bookingDetails.paymentMethod === "online" 
                    ? "You will be redirected to our secure payment gateway."
                    : "Please pay cash/UPI at the lab counter."}
                </p>
              </div>
            </div>
            
            <DialogFooter className="px-6 pb-6 pt-2 gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsConfirmationOpen(false)} className="rounded-xl h-11 border-gray-200">
                Back
              </Button>
              <Button onClick={confirmBooking} className="rounded-xl h-11 bg-primary hover:bg-primary/90">
                Confirm & Pay
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TestBooking;
