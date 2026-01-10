import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, TestTube, Stethoscope, ChevronRight, Download, Eye, X, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Demo appointment data
const initialAppointments = [
  {
    id: 1,
    type: "Lab Test",
    name: "Complete Blood Count (CBC)",
    date: "2024-01-15",
    time: "10:30 AM",
    status: "Completed",
    lab: "HealthPlus Diagnostics",
    icon: TestTube,
    hasReport: true,
    reportUrl: "/reports/cbc-2024-01.pdf",
    price: 599,
    details: "A complete blood count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders."
  },
  {
    id: 2,
    type: "Doctor",
    name: "Dr. Rahul Sharma - Cardiologist",
    date: "2024-01-22",
    time: "4:00 PM",
    status: "Upcoming",
    location: "Apollo Hospital, Koramangala",
    icon: Stethoscope,
    hasReport: false,
    price: 800,
    details: "Regular cardiac checkup and consultation for heart health monitoring."
  },
  {
    id: 3,
    type: "Lab Test",
    name: "Lipid Profile",
    date: "2024-02-10",
    time: "9:00 AM",
    status: "Scheduled",
    lab: "Metropolis Labs",
    icon: TestTube,
    hasReport: false,
    price: 450,
    details: "A lipid profile is a blood test that measures lipids—fats and fatty substances used as a source of energy by your body."
  }
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "Upcoming":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Scheduled":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const AppointmentsTab = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof initialAppointments[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (appointment: typeof initialAppointments[0]) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  const handleDownloadReport = (appointment: typeof initialAppointments[0]) => {
    toast.success(`Downloading report for ${appointment.name}...`);
    // In a real app, this would trigger a file download
  };

  const handleCancelAppointment = (appointmentId: number) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: "Cancelled" } 
          : apt
      )
    );
    setIsDetailsOpen(false);
    toast.success("Appointment cancelled successfully");
  };

  const handleReschedule = (appointment: typeof initialAppointments[0]) => {
    setIsDetailsOpen(false);
    if (appointment.type === "Lab Test") {
      navigate(`/lab-tests`);
    } else {
      navigate(`/doctors`);
    }
    toast.info("Please select a new time slot");
  };

  const handleBookNew = () => {
    navigate("/lab-tests");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Appointment History
              </CardTitle>
              <CardDescription className="mt-1">
                View your past and upcoming appointments
              </CardDescription>
            </div>
            <Button onClick={handleBookNew} className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Calendar className="h-4 w-4 mr-2" />
              Book New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Appointments Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't booked any appointments yet.
              </p>
              <Button onClick={handleBookNew} className="rounded-xl">Book Your First Appointment</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {appointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-4 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                          appointment.type === "Lab Test" 
                            ? "bg-cyan-100 text-cyan-600" 
                            : "bg-purple-100 text-purple-600"
                        }`}>
                          <appointment.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              {appointment.type}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusStyles(appointment.status)}`}
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{appointment.name}</h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{appointment.type === "Lab Test" ? appointment.lab : appointment.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {new Date(appointment.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            {appointment.time}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {appointment.hasReport && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDownloadReport(appointment)}
                              className="rounded-lg text-xs h-8 bg-white/50 hover:bg-primary hover:text-white transition-colors"
                            >
                              <Download className="h-3.5 w-3.5 mr-1.5" />
                              Report
                            </Button>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewDetails(appointment)}
                            className="rounded-lg text-xs h-8 text-primary"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {appointments.length > 0 && (
            <div className="flex justify-center pt-6 border-t border-slate-100 mt-6">
              <Button 
                variant="outline" 
                className="rounded-xl"
                onClick={() => navigate("/orders")}
              >
                View All Orders
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    selectedAppointment.type === "Lab Test" 
                      ? "bg-cyan-100 text-cyan-600" 
                      : "bg-purple-100 text-purple-600"
                  }`}>
                    <selectedAppointment.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg">{selectedAppointment.name}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusStyles(selectedAppointment.status)}`}
                      >
                        {selectedAppointment.status}
                      </Badge>
                      <span>₹{selectedAppointment.price}</span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Date</span>
                      <p className="font-medium">{new Date(selectedAppointment.date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time</span>
                      <p className="font-medium">{selectedAppointment.time}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Location</span>
                      <p className="font-medium">{selectedAppointment.type === "Lab Test" ? selectedAppointment.lab : selectedAppointment.location}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">About</h4>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.details}</p>
                </div>
              </div>

              <DialogFooter className="flex gap-2 mt-4">
                {selectedAppointment.status !== "Completed" && selectedAppointment.status !== "Cancelled" && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => handleCancelAppointment(selectedAppointment.id)}
                      className="rounded-xl text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleReschedule(selectedAppointment)}
                      className="rounded-xl"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                  </>
                )}
                {selectedAppointment.hasReport && (
                  <Button 
                    onClick={() => handleDownloadReport(selectedAppointment)}
                    className="rounded-xl bg-primary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AppointmentsTab;
