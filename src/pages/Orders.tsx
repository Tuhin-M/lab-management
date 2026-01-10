import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Download,
  Package,
  CheckCircle,
  AlertCircle,
  TestTube,
  User,
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
  Clock3,
  X,
  Phone,
  CreditCard,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Define types for different order types
interface BaseOrder {
  id: string;
  type: "doctor" | "lab";
  status: string;
  date: string;
  time: string;
  paymentStatus: string;
  amount: number;
  address: string;
}

interface DoctorOrder extends BaseOrder {
  type: "doctor";
  doctor: string;
  specialty: string;
  hospital: string;
  prescriptionUrl?: string;
}

interface LabOrder extends BaseOrder {
  type: "lab";
  lab: string;
  tests: string[];
  trackingSteps: Array<{
    id: number;
    label: string;
    completed: boolean;
    date?: string;
  }>;
  reportUrl?: string;
}

type Order = DoctorOrder | LabOrder;

// Sample data for orders
const initialAppointmentOrders: DoctorOrder[] = [
  {
    id: "APT-001",
    type: "doctor",
    status: "upcoming",
    doctor: "Dr. Rajesh Sharma",
    specialty: "Cardiologist",
    hospital: "City Heart Hospital",
    date: "2023-06-15",
    time: "10:00 AM",
    paymentStatus: "paid",
    amount: 800,
    address: "123 Hospital Road, Mumbai",
  },
  {
    id: "APT-002",
    type: "doctor",
    status: "completed",
    doctor: "Dr. Priya Patel",
    specialty: "Dermatologist",
    hospital: "Skin Care Clinic",
    date: "2023-05-20",
    time: "11:30 AM",
    paymentStatus: "paid",
    amount: 600,
    address: "456 Health Avenue, Delhi",
    prescriptionUrl: "#",
  },
];

const initialLabOrders: LabOrder[] = [
  {
    id: "LAB-001",
    type: "lab",
    status: "processing",
    lab: "HealthPlus Diagnostics",
    tests: ["Complete Blood Count", "Lipid Profile"],
    date: "2023-06-10",
    time: "08:00 AM",
    paymentStatus: "paid",
    amount: 1200,
    address: "789 Lab Road, Bangalore",
    trackingSteps: [
      { id: 1, label: "Order Placed", completed: true, date: "2023-06-08" },
      { id: 2, label: "Sample Collection", completed: true, date: "2023-06-10" },
      { id: 3, label: "Testing in Progress", completed: false },
      { id: 4, label: "Results Processing", completed: false },
      { id: 5, label: "Report Ready", completed: false },
    ],
  },
  {
    id: "LAB-002",
    type: "lab",
    status: "completed",
    lab: "MediScan Labs",
    tests: ["Thyroid Profile", "Vitamin D3"],
    date: "2023-05-15",
    time: "09:30 AM",
    paymentStatus: "paid",
    amount: 1500,
    address: "321 Lab Complex, Chennai",
    reportUrl: "#",
    trackingSteps: [
      { id: 1, label: "Order Placed", completed: true, date: "2023-05-13" },
      { id: 2, label: "Sample Collection", completed: true, date: "2023-05-15" },
      { id: 3, label: "Testing in Progress", completed: true, date: "2023-05-16" },
      { id: 4, label: "Results Processing", completed: true, date: "2023-05-17" },
      { id: 5, label: "Report Ready", completed: true, date: "2023-05-18" },
    ],
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  let className = "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200";
  let icon = null;

  switch (status) {
    case "completed":
    case "paid":
      className = "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      icon = <CheckCircle2 className="w-3 h-3 mr-1" />;
      break;
    case "upcoming":
    case "processing":
      className = "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200";
      icon = <Clock3 className="w-3 h-3 mr-1" />;
      break;
    case "cancelled":
      className = "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
      icon = <X className="w-3 h-3 mr-1" />;
      break;
  }

  return (
    <Badge variant="outline" className={`capitalize px-2.5 py-0.5 shadow-none border ${className}`}>
      {icon}
      {status}
    </Badge>
  );
}

const OrderCard = ({ 
  order, 
  index,
  onCancel,
  onViewDetails
}: { 
  order: Order; 
  index: number;
  onCancel: (order: Order) => void;
  onViewDetails: (order: Order) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="mb-4 overflow-hidden border-0 bg-white/90 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300 group rounded-2xl ring-1 ring-gray-200/50">
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-100/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-2xl ${order.type === 'doctor' ? 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600' : 'bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600'} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  {order.type === 'doctor' ? <User className="h-6 w-6" /> : <TestTube className="h-6 w-6" />}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                      {order.type === "doctor" ? order.doctor : order.lab}
                    </h3>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {order.type === "doctor" ? order.specialty : order.tests.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <div className="text-xl font-bold text-primary">₹{order.amount.toLocaleString()}</div>
                 <StatusBadge status={order.paymentStatus} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground bg-gradient-to-r from-blue-50 to-blue-100/50 p-3.5 rounded-xl border border-blue-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <span className="font-semibold text-foreground text-base">{new Date(order.date).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground bg-gradient-to-r from-green-50 to-green-100/50 p-3.5 rounded-xl border border-green-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <span className="font-semibold text-foreground text-base">{order.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground bg-gradient-to-r from-orange-50 to-orange-100/50 p-3.5 rounded-xl border border-orange-100 sm:col-span-2 md:col-span-1">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <MapPin className="h-5 w-5 text-orange-600 flex-shrink-0" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <span className="truncate font-semibold text-foreground text-base block" title={order.address}>{order.address}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Order-specific content */}
          {order.type === "lab" && (
            <div className="p-5 bg-gradient-to-b from-gray-50/80 to-white/50">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tracking" className="border-b-0">
                  <AccordionTrigger className="text-sm py-3 hover:no-underline px-5 rounded-xl hover:bg-white/80 transition-colors bg-white/50 shadow-sm">
                    <span className="font-semibold flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      Track Order Status
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pt-6">
                    <div className="relative">
                      <div className="absolute left-[18px] top-2 bottom-2 w-1 bg-gray-200 rounded-full"></div>
                      <div 
                        className="absolute left-[18px] top-2 w-1 bg-gradient-to-b from-primary to-green-500 rounded-full transition-all duration-500"
                        style={{ height: `${(order.trackingSteps.filter(s => s.completed).length / order.trackingSteps.length) * 100}%` }}
                      ></div>
                      
                      <ol className="relative space-y-5">
                        {order.trackingSteps.map((step) => (
                          <li key={step.id} className="relative pl-10">
                            <div className={`absolute w-5 h-5 rounded-full left-[7px] flex items-center justify-center transition-all duration-300 ${
                              step.completed 
                                ? 'bg-gradient-to-br from-primary to-green-500 shadow-lg shadow-primary/30' 
                                : 'bg-gray-200 border-2 border-gray-300'
                            }`}>
                              {step.completed && <CheckCircle className="h-3 w-3 text-white" />}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-white/60 rounded-xl hover:bg-white transition-colors">
                              <div>
                                <h3 className={`text-sm font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                  {step.label}
                                </h3>
                                {step.date && <time className="text-xs text-muted-foreground">{step.date}</time>}
                              </div>
                              {step.completed && (
                                <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full w-fit shadow-sm">
                                  <CheckCircle className="mr-1 h-3 w-3" /> Done
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="description" className="border-b-0 mt-2">
                  <AccordionTrigger className="text-sm py-3 hover:no-underline px-5 rounded-xl hover:bg-white/80 transition-colors bg-white/50 shadow-sm">
                    <span className="font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      View Test Description
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pt-4">
                    <div className="bg-white/60 rounded-xl p-4 space-y-3">
                      {order.tests.map((test, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <TestTube className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">{test}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              A comprehensive test to evaluate your health status. Results typically available within 6-24 hours.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
                {order.status === "processing" && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onCancel(order)}
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white hover:bg-gray-50"
                  onClick={() => onViewDetails(order)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                {order.status === "completed" && order.reportUrl && (
                  <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {order.type === "doctor" && (
            <div className="p-4 bg-gray-50/50 flex justify-end gap-3">
              {order.status === "completed" && order.prescriptionUrl && (
                 <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
                  <FileText className="mr-2 h-4 w-4" />
                  View Prescription
                </Button>
              )}
              {order.status === "upcoming" && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onCancel(order)}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Cancel Appointment
                </Button>
              )}
               <Button 
                 variant="outline" 
                 size="sm" 
                 className="bg-white hover:bg-gray-50"
                 onClick={() => onViewDetails(order)}
               >
                 View Details
               </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Load orders from localStorage or use initial data
  const [appointmentOrders, setAppointmentOrders] = useState<DoctorOrder[]>(() => {
    const saved = localStorage.getItem('ekitsa_appointment_orders');
    return saved ? JSON.parse(saved) : initialAppointmentOrders;
  });
  
  const [labOrders, setLabOrders] = useState<LabOrder[]>(() => {
    const saved = localStorage.getItem('ekitsa_lab_orders');
    return saved ? JSON.parse(saved) : initialLabOrders;
  });
  
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ekitsa_appointment_orders', JSON.stringify(appointmentOrders));
  }, [appointmentOrders]);
  
  useEffect(() => {
    localStorage.setItem('ekitsa_lab_orders', JSON.stringify(labOrders));
  }, [labOrders]);
  
  const allOrders: Order[] = [...appointmentOrders, ...labOrders];
  
  // Filter orders based on active tab
  const filteredOrders = activeTab === "all" 
    ? allOrders 
    : activeTab === "doctor" 
      ? appointmentOrders 
      : labOrders;

  const handleCancelClick = (order: Order) => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

  const handleViewDetailsClick = (order: Order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const confirmCancel = () => {
    if (!selectedOrder) return;
    
    if (selectedOrder.type === "doctor") {
      setAppointmentOrders(prev => 
        prev.map(o => o.id === selectedOrder.id ? { ...o, status: "cancelled" } : o)
      );
    } else {
      setLabOrders(prev => 
        prev.map(o => o.id === selectedOrder.id ? { ...o, status: "cancelled" } : o)
      );
    }
    
    toast.success(`${selectedOrder.type === "doctor" ? "Appointment" : "Order"} cancelled successfully`);
    setCancelDialogOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-12 relative overflow-hidden">
       {/* Background Elements */}
       <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
       <div className="fixed left-0 top-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
       <div className="fixed right-0 bottom-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <main className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Premium Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-white/20 backdrop-blur-md shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/20 rounded-xl">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Orders</h1>
                    </div>
                    <p className="text-muted-foreground">Track your past and upcoming appointments and lab tests</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <div className="relative hidden sm:block">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Search orders..." 
                        className="h-9 w-full rounded-xl border border-input bg-white/80 backdrop-blur-sm px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20" 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{allOrders.length}</p>
                        <p className="text-xs text-muted-foreground">Total Orders</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{allOrders.filter(o => o.status === 'completed').length}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{allOrders.filter(o => o.status === 'processing' || o.status === 'upcoming').length}</p>
                        <p className="text-xs text-muted-foreground">In Progress</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <TestTube className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{labOrders.length}</p>
                        <p className="text-xs text-muted-foreground">Lab Tests</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-md border border-gray-200/50 p-1 rounded-xl shadow-sm">
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary transition-all">All Orders</TabsTrigger>
              <TabsTrigger value="doctor" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary transition-all">Doctor Appointments</TabsTrigger>
              <TabsTrigger value="lab" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary transition-all">Lab Tests</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                   key={activeTab}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 10 }}
                   transition={{ duration: 0.3 }}
                >
                  <TabsContent value="all" className="mt-0">
                    <div className="space-y-4">
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order, index) => (
                          <OrderCard 
                            key={order.id} 
                            order={order} 
                            index={index} 
                            onCancel={handleCancelClick}
                            onViewDetails={handleViewDetailsClick}
                          />
                        ))
                      ) : (
                        <EmptyState />
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="doctor" className="mt-0">
                    <div className="space-y-4">
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order, index) => (
                          <OrderCard 
                            key={order.id} 
                            order={order} 
                            index={index}
                            onCancel={handleCancelClick}
                            onViewDetails={handleViewDetailsClick}
                          />
                        ))
                      ) : (
                        <EmptyState type="doctor" />
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="lab" className="mt-0">
                    <div className="space-y-4">
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order, index) => (
                          <OrderCard 
                            key={order.id} 
                            order={order} 
                            index={index}
                            onCancel={handleCancelClick}
                            onViewDetails={handleViewDetailsClick}
                          />
                        ))
                      ) : (
                        <EmptyState type="lab" />
                      )}
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </main>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Cancel {selectedOrder?.type === "doctor" ? "Appointment" : "Order"}?
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to cancel this {selectedOrder?.type === "doctor" ? "appointment" : "order"}?
              {selectedOrder?.type === "doctor" && " Your appointment slot will be released."}
              {selectedOrder?.type === "lab" && " Your order will be cancelled and a refund will be initiated."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="bg-gray-50 rounded-xl p-4 my-2">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${selectedOrder.type === 'doctor' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                  {selectedOrder.type === 'doctor' ? <User className="h-5 w-5" /> : <TestTube className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-semibold">{selectedOrder.type === "doctor" ? selectedOrder.doctor : selectedOrder.lab}</p>
                  <p className="text-sm text-muted-foreground">{new Date(selectedOrder.date).toLocaleDateString()} at {selectedOrder.time}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep {selectedOrder?.type === "doctor" ? "Appointment" : "Order"}
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Order Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${selectedOrder.type === 'doctor' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                    {selectedOrder.type === 'doctor' ? <User className="h-6 w-6" /> : <TestTube className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{selectedOrder.type === "doctor" ? selectedOrder.doctor : selectedOrder.lab}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.type === "doctor" ? selectedOrder.specialty : selectedOrder.tests.join(", ")}
                    </p>
                  </div>
                </div>
                <StatusBadge status={selectedOrder.status} />
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs">Date</span>
                  </div>
                  <p className="font-semibold">{new Date(selectedOrder.date).toLocaleDateString(undefined, { dateStyle: "long" })}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Time</span>
                  </div>
                  <p className="font-semibold">{selectedOrder.time}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs">Location</span>
                  </div>
                  <p className="font-semibold">{selectedOrder.address}</p>
                </div>
                {selectedOrder.type === "doctor" && (
                  <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Building2 className="h-4 w-4" />
                      <span className="text-xs">Hospital</span>
                    </div>
                    <p className="font-semibold">{selectedOrder.hospital}</p>
                  </div>
                )}
              </div>
              
              {/* Payment Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Payment Details
                </h4>
                <div className="flex justify-between items-center bg-primary/5 rounded-xl p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">₹{selectedOrder.amount.toLocaleString()}</p>
                  </div>
                  <StatusBadge status={selectedOrder.paymentStatus} />
                </div>
              </div>
              
              {/* Order ID */}
              <div className="border-t pt-4 flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono font-semibold">{selectedOrder.id}</span>
              </div>
              
              {/* Contact */}
              <div className="border-t pt-4">
                <Button variant="outline" className="w-full" asChild>
                  <a href="tel:+919876543210">
                    <Phone className="mr-2 h-4 w-4" />
                    Contact Support
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const EmptyState = ({ type = "all" }: { type?: "all" | "doctor" | "lab" }) => {
  const icon = type === "doctor" ? <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" /> : 
               type === "lab" ? <TestTube className="h-12 w-12 mx-auto text-muted-foreground mb-4" /> : 
               <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />;

  const title = type === "doctor" ? "No doctor appointments found" : 
                type === "lab" ? "No lab tests found" : 
                "No orders found";
  
  const description = type === "doctor" ? "You haven't booked any doctor appointments yet." : 
                      type === "lab" ? "You haven't booked any lab tests yet." : 
                      "You haven't placed any orders yet.";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 bg-white/60 backdrop-blur-sm border border-dashed border-gray-300 rounded-xl"
    >
      <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm mx-auto">{description}</p>
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        {(type === "all" || type === "doctor") && (
          <Button asChild variant="outline" className="bg-white hover:bg-gray-50 shadow-sm">
            <Link to="/doctors">
              <User className="mr-2 h-4 w-4" />
              Book Doctor Appointment
            </Link>
          </Button>
        )}
        {(type === "all" || type === "lab") && (
          <Button asChild className="shadow-lg shadow-primary/20 hover:shadow-primary/40">
            <Link to="/lab-tests">
              <TestTube className="mr-2 h-4 w-4" />
              Book Lab Test
            </Link>
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default Orders;
