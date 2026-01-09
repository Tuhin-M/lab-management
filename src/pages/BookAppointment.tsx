
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  Calendar as CalendarIcon, 
  FileUp, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const appointmentFormSchema = z.object({
  patientName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  patientAge: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 120, {
    message: "Age must be a number between 1 and 120",
  }),
  patientGender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  patientPhone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  patientEmail: z.string().email({ message: "Invalid email address" }).optional(),
  appointmentDate: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  symptoms: z.string().min(10, { message: "Please describe your symptoms in at least 10 characters" }),
  paymentMethod: z.enum(["online", "cash"], {
    required_error: "Please select a payment method",
  }),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

const BookAppointment = () => {
  const navigate = useNavigate();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<AppointmentFormValues | null>(null);
  const [prescription, setPrescription] = useState<File | null>(null);
  
  // Time slots
  const timeSlots = [
    "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM",
  ];

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientName: "",
      patientAge: "",
      patientGender: "male",
      patientPhone: "",
      patientEmail: "",
      symptoms: "",
      paymentMethod: "online",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPrescription(e.target.files[0]);
    }
  };

  const onSubmit = (data: AppointmentFormValues) => {
    if (!prescription) {
      toast.error("Please upload your prescription");
      return;
    }
    
    console.log("Booking data:", data);
    console.log("Prescription:", prescription);
    setBookingDetails(data);
    setIsConfirmationOpen(true);
  };

  const confirmBooking = () => {
    setIsConfirmationOpen(false);
    toast.success("Appointment booked successfully! You will be redirected to the payment page.");
    // In a real app, you would process the payment here
    // After payment, navigate to the orders page
    setTimeout(() => {
      navigate("/orders");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-14">
      <main className="flex-grow container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Book Your Appointment</h1>
          
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
                    <h3 className="text-lg font-medium">Appointment Details</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <FormField
                          control={form.control}
                          name="appointmentDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Appointment Date</FormLabel>
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
                                  <FormItem key={slot} className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem 
                                        checked={field.value === slot}
                                        value={slot} 
                                        onSelect={() => field.onChange(slot)}
                                        className="peer sr-only"
                                        id={`time-${slot}`}
                                      />
                                    </FormControl>
                                    <Label 
                                      htmlFor={`time-${slot}`}
                                      className="flex justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-data-[state=checked]:text-primary cursor-pointer text-xs w-full"
                                    >
                                      {slot}
                                    </Label>
                                  </FormItem>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="symptoms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Symptoms Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe your symptoms or health concerns"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label htmlFor="prescription">Upload Prescription (required)</Label>
                      <div className="grid w-full items-center gap-1.5">
                        <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => document.getElementById('prescription')?.click()}>
                          <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground text-center">
                            {prescription ? prescription.name : "Click to upload prescription"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Supported formats: JPG, PNG, PDF (Max size: 5MB)
                          </p>
                        </div>
                        <Input 
                          id="prescription" 
                          type="file" 
                          accept=".jpg,.jpeg,.png,.pdf" 
                          className="hidden" 
                          onChange={handleFileChange}
                        />
                      </div>
                      {!prescription && (
                        <p className="text-sm text-destructive">Prescription is required</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
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
                                  <span className="font-semibold">Pay Later</span>
                                  <span className="text-xs text-center mt-1">Pay at the hospital or clinic</span>
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">Book Appointment</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Confirmation Dialog */}
      {bookingDetails && (
        <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Your Appointment</DialogTitle>
              <DialogDescription>
                Please review the details before confirming your appointment.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="bg-primary/5 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date:</p>
                    <p className="font-medium">{format(bookingDetails.appointmentDate, "MMMM d, yyyy")}</p>
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
                    <p className="text-muted-foreground">Phone:</p>
                    <p className="font-medium">{bookingDetails.patientPhone}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Consultation Fee</span>
                  <span>₹500</span>
                </div>
              </div>
              
              <div className="flex items-start bg-blue-50 p-3 rounded-md text-sm">
                <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-blue-700">
                  {bookingDetails.paymentMethod === "online" 
                    ? "You will be redirected to payment gateway after confirmation."
                    : "Please pay at the hospital or clinic during your visit."}
                </p>
              </div>
            </div>
            
            <DialogFooter className="flex space-x-2 sm:space-x-0">
              <Button variant="outline" onClick={() => setIsConfirmationOpen(false)}>
                Edit Details
              </Button>
              <Button onClick={confirmBooking}>
                Confirm & Proceed
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BookAppointment;
