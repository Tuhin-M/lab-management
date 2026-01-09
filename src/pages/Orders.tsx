import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Clock3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

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
const appointmentOrders: DoctorOrder[] = [
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

const labOrders: LabOrder[] = [
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

// Combine all orders
const allOrders: Order[] = [...appointmentOrders, ...labOrders];

const StatusBadge = ({ status }: { status: string }) => {
  let variant = "secondary";
  let className = "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200";
  let icon = null;

  switch (status) {
    case "completed":
    case "paid":
      variant = "default";
      className = "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      icon = <CheckCircle2 className="w-3 h-3 mr-1" />;
      break;
    case "upcoming":
    case "processing":
      variant = "outline";
      className = "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200";
      icon = <Clock3 className="w-3 h-3 mr-1" />;
      break;
    case "destructive":
    case "cancelled":
      variant = "destructive";
      className = "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
      icon = <AlertCircle className="w-3 h-3 mr-1" />;
      break;
  }

  return (
    <Badge variant="outline" className={`capitalize px-2.5 py-0.5 shadow-none border ${className}`}>
      {icon}
      {status}
    </Badge>
  );
}

const OrderCard = ({ order, index }: { order: Order; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="mb-4 overflow-hidden border-white/20 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-0">
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${order.type === 'doctor' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'} group-hover:scale-110 transition-transform duration-300`}>
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
                 <div className="text-lg font-bold text-primary">₹{order.amount}</div>
                 <StatusBadge status={order.paymentStatus} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground bg-secondary/30 p-2 rounded-lg">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">{new Date(order.date).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground bg-secondary/30 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">{order.time}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground bg-secondary/30 p-2 rounded-lg sm:col-span-2 md:col-span-1">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="truncate font-medium text-foreground" title={order.address}>{order.address}</span>
              </div>
            </div>
          </div>
          
          {/* Order-specific content */}
          {order.type === "lab" && (
            <div className="p-4 bg-gray-50/50">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tracking" className="border-b-0">
                  <AccordionTrigger className="text-sm py-2 hover:no-underline px-4 rounded-lg hover:bg-white transition-colors">
                    <span className="font-medium">Track Order Status</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-4">
                    <div className="space-y-4 py-2 relative pl-2">
                       <div className="absolute left-[20px] top-4 bottom-4 w-0.5 bg-gray-200"></div>
                      <ol className="relative space-y-6">
                        {order.trackingSteps.map((step) => (
                          <li key={step.id} className="relative pl-8">
                            <div className={`absolute w-4 h-4 rounded-full mt-0.5 left-1 border-2 border-white shadow-sm z-10 ${step.completed ? 'bg-primary' : 'bg-gray-300'}`}></div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <div>
                                <h3 className={`text-sm font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                  {step.label}
                                </h3>
                                {step.date && <time className="text-xs text-gray-400 font-medium">{step.date}</time>}
                              </div>
                              {step.completed && (
                                <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                                  <CheckCircle className="mr-1 h-3 w-3" /> Completed
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {order.status === "completed" && order.reportUrl && (
                <div className="mt-4 flex justify-end">
                  <Button variant="default" size="sm" className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                    <Download className="mr-2 h-4 w-4" />
                    Download Lab Report
                  </Button>
                </div>
              )}
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
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Cancel Appointment
                </Button>
              )}
               <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
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
  
  // Filter orders based on active tab
  const filteredOrders = activeTab === "all" 
    ? allOrders 
    : activeTab === "doctor" 
      ? appointmentOrders 
      : labOrders;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-12 relative overflow-hidden">
       {/* Background Elements */}
       <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
       <div className="fixed left-0 top-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
       <div className="fixed right-0 bottom-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <main className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Orders</h1>
              <p className="text-muted-foreground mt-1">Track your past and upcoming appointments and lab tests</p>
            </div>
            
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
                  <Filter className="mr-2 h-4 w-4" /> Filter
               </Button>
                <div className="relative hidden sm:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search orders..." 
                    className="h-9 w-full rounded-md border border-input bg-white/80 backdrop-blur-sm px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                  />
                </div>
            </div>
          </div>
          
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
                          <OrderCard key={order.id} order={order} index={index} />
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
                          <OrderCard key={order.id} order={order} index={index} />
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
                          <OrderCard key={order.id} order={order} index={index} />
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
