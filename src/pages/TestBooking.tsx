import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { TestTube, Calendar as CalendarIcon, MapPin, CreditCard, Clock, User, Home, Building2, CheckCircle, Info } from "lucide-react";
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
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow container mx-auto py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Book Your Test</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Details & Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Patient Information</h3>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="patientName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
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
                                  <Input placeholder="35" {...field} />
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
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="male" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      Male
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="female" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      Female
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="other" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      Other
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="patientPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="9876543210" {...field} />
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
                                  <Input type="email" placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-lg font-medium">Collection Type</h3>
                        
                        <FormField
                          control={form.control}
                          name="collectionType"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-2 gap-4"
                                >
                                  <FormItem>
                                    <FormControl>
                                      <RadioGroupItem value="lab" className="sr-only peer" />
                                    </FormControl>
                                    <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                      <Building2 className="mb-3 h-6 w-6" />
                                      <span className="font-semibold">Visit Lab</span>
                                      <span className="text-xs text-center mt-1">Visit the lab location for sample collection</span>
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem>
                                    <FormControl>
                                      <RadioGroupItem value="home" className="sr-only peer" />
                                    </FormControl>
                                    <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                      <Home className="mb-3 h-6 w-6" />
                                      <span className="font-semibold">Home Collection</span>
                                      <span className="text-xs text-center mt-1">Get samples collected at your home (+₹100)</span>
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {collectionType === "home" && (
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Home Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your complete address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <div className="grid md:grid-cols-2 gap-4 pt-4">
                          <div>
                            <FormField
                              control={form.control}
                              name="testDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Preferred Date</FormLabel>
                                  <FormControl>
                                    <div className="border rounded-md p-1">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => 
                                          date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))
                                        }
                                        initialFocus
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
                                  <FormLabel>Preferred Time</FormLabel>
                                  <div className="grid grid-cols-2 gap-2 h-[280px] overflow-y-auto border rounded-md p-2">
                                    {timeSlots.map((slot) => (
                                      <div key={slot} className="flex items-center space-x-2">
                                        <RadioGroup 
                                          value={field.value} 
                                          onValueChange={field.onChange}
                                          className="hidden"
                                        >
                                          <RadioGroupItem value={slot} id={`time-${slot}`} />
                                        </RadioGroup>
                                        <Label 
                                          htmlFor={`time-${slot}`}
                                          className={`flex justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-xs w-full ${field.value === slot ? 'border-primary text-primary' : ''}`}
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

                        <div className="pt-4">
                          <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                          
                          <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-2 gap-4"
                                  >
                                    <FormItem>
                                      <FormControl>
                                        <RadioGroupItem value="online" className="sr-only peer" />
                                      </FormControl>
                                      <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                        <CreditCard className="mb-3 h-6 w-6" />
                                        <span className="font-semibold">Online Payment</span>
                                        <span className="text-xs text-center mt-1">Pay securely with card, UPI, or net banking</span>
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem>
                                      <FormControl>
                                        <RadioGroupItem value="cash" className="sr-only peer" />
                                      </FormControl>
                                      <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                        <svg className="mb-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="font-semibold">Pay on Collection</span>
                                        <span className="text-xs text-center mt-1">Pay cash during sample collection</span>
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

                      <Button type="submit" className="w-full">Complete Booking</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="space-y-6 md:sticky md:top-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <TestTube className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-semibold">{testData.name}</h3>
                          <p className="text-xs text-muted-foreground">{testData.sampleType} Test</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm line-through text-muted-foreground">₹{testData.price}</span>
                          <span className="text-xl font-bold text-primary ml-2">₹{testData.discountPrice}</span>
                        </div>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">33% OFF</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Results in {testData.turnaroundTime}</span>
                      </div>
                      
                      <div className="text-sm">
                        <p className="font-medium mb-1">Preparation:</p>
                        <p className="text-muted-foreground">{testData.preparation}</p>
                      </div>
                      
                      <div className="text-sm">
                        <p className="font-medium mb-1">Parameters:</p>
                        <ul className="text-muted-foreground grid grid-cols-2 gap-x-2 gap-y-1">
                          {testData.parameters.slice(0, 6).map((param, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1 text-primary" />
                              {param}
                            </li>
                          ))}
                          {testData.parameters.length > 6 && (
                            <li className="text-primary cursor-pointer">+{testData.parameters.length - 6} more</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Lab Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <div className="w-12 h-12 rounded-md overflow-hidden">
                          <img 
                            src={labData.images[0]} 
                            alt={labData.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{labData.name}</h3>
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm ml-1">{labData.rating} ({labData.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>

                      {labData.nabl && (
                        <div className="flex items-center text-sm text-green-600 bg-green-50 p-2 rounded">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>NABL Accredited Lab</span>
                        </div>
                      )}
                      
                      <div className="text-sm space-y-2">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                          <span>{labData.address}</span>
                        </div>
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                          <div>
                            <p>{labData.openHours}</p>
                            <p className="text-xs">{labData.daysOpen}</p>
                          </div>
                        </div>
                      </div>
                      
                      {labData.homeCollection && (
                        <div className="text-sm flex items-center">
                          <Home className="h-4 w-4 text-primary mr-2" />
                          <span>Home collection available (+₹{labData.homeCollectionCharges})</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm space-y-3">
                      <div className="flex justify-between">
                        <span>Test Price</span>
                        <span>₹{testData.discountPrice}</span>
                      </div>
                      {collectionType === "home" && (
                        <div className="flex justify-between">
                          <span>Home Collection Fee</span>
                          <span>₹{labData.homeCollectionCharges}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                        <span>Total Amount</span>
                        <span>₹{testData.discountPrice + (collectionType === "home" ? labData.homeCollectionCharges : 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {bookingDetails && (
        <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Your Booking</DialogTitle>
              <DialogDescription>
                Please review the details before confirming your test booking.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="bg-primary/5 p-4 rounded-md">
                <div className="flex items-center space-x-2 mb-2">
                  <TestTube className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{testData.name}</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date:</p>
                    <p className="font-medium">{format(bookingDetails.testDate, "MMMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time:</p>
                    <p className="font-medium">{bookingDetails.timeSlot}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Patient:</p>
                    <p className="font-medium">{bookingDetails.patientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Collection:</p>
                    <p className="font-medium">{bookingDetails.collectionType === "home" ? "Home Collection" : "Visit Lab"}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Test Price</span>
                  <span>₹{testData.discountPrice}</span>
                </div>
                {bookingDetails.collectionType === "home" && (
                  <div className="flex justify-between text-sm mb-1">
                    <span>Home Collection Fee</span>
                    <span>₹{labData.homeCollectionCharges}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Total Amount</span>
                  <span>₹{testData.discountPrice + (bookingDetails.collectionType === "home" ? labData.homeCollectionCharges : 0)}</span>
                </div>
              </div>
              
              <div className="flex items-start mt-4 bg-blue-50 p-3 rounded-md text-sm">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-blue-700">
                  {bookingDetails.paymentMethod === "online" 
                    ? "You will be redirected to payment gateway after confirmation."
                    : "Please pay the amount during sample collection."}
                </p>
              </div>
            </div>
            
            <DialogFooter className="flex space-x-2 sm:space-x-0">
              <Button variant="outline" onClick={() => setIsConfirmationOpen(false)}>
                Edit Details
              </Button>
              <Button onClick={confirmBooking}>
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TestBooking;
