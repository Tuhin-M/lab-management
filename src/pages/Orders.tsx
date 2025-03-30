
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Download,
  Truck,
  Package,
  CheckCircle,
  AlertCircle,
  TestTube,
  User,
} from "lucide-react";

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

const OrderCard = ({ order }: { order: Order }) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">
                  {order.type === "doctor" ? order.doctor : order.lab}
                </h3>
                <Badge variant={order.status === "completed" ? "success" : order.status === "upcoming" || order.status === "processing" ? "outline" : "secondary"}>
                  {order.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {order.type === "doctor" ? order.specialty : order.tests.join(", ")}
              </p>
            </div>
            <Badge variant={order.paymentStatus === "paid" ? "success" : "destructive"}>
              {order.paymentStatus}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 mt-3 gap-y-2 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{order.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{order.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>₹{order.amount}</span>
            </div>
          </div>
        </div>
        
        {/* Order-specific content */}
        {order.type === "lab" && (
          <div className="p-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="tracking">
                <AccordionTrigger className="text-sm py-2">View Tracking Details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 py-2">
                    <ol className="relative border-l border-gray-200">
                      {order.trackingSteps.map((step) => (
                        <li key={step.id} className="mb-6 ml-4 last:mb-0">
                          <div className={`absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 ${step.completed ? 'bg-primary' : 'bg-gray-200'}`}></div>
                          <div className="flex items-start">
                            <div>
                              <time className="mb-1 text-xs font-normal leading-none text-gray-400">{step.date || ''}</time>
                              <h3 className={`text-sm font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                {step.label}
                              </h3>
                            </div>
                            {step.completed && (
                              <CheckCircle className="ml-auto h-4 w-4 text-green-500" />
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
              <div className="mt-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>
            )}
          </div>
        )}
        
        {order.type === "doctor" && order.status === "completed" && order.prescriptionUrl && (
          <div className="p-4">
            <Button variant="outline" size="sm" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              View Prescription
            </Button>
          </div>
        )}
        
        {order.type === "doctor" && order.status === "upcoming" && (
          <div className="p-4">
            <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive">
              <AlertCircle className="mr-2 h-4 w-4" />
              Cancel Appointment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Orders</h1>
          </div>
          
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="doctor">Doctor Appointments</TabsTrigger>
              <TabsTrigger value="lab">Lab Tests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No orders found</h3>
                    <p className="text-muted-foreground mt-2">You haven't placed any orders yet.</p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild variant="outline">
                        <Link to="/doctors">
                          <User className="mr-2 h-4 w-4" />
                          Book Doctor Appointment
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link to="/lab-tests">
                          <TestTube className="mr-2 h-4 w-4" />
                          Book Lab Test
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="doctor" className="mt-4">
              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No doctor appointments found</h3>
                    <p className="text-muted-foreground mt-2">You haven't booked any doctor appointments yet.</p>
                    <Button asChild className="mt-6">
                      <Link to="/doctors">
                        Book Doctor Appointment
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="lab" className="mt-4">
              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <TestTube className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No lab tests found</h3>
                    <p className="text-muted-foreground mt-2">You haven't booked any lab tests yet.</p>
                    <Button asChild className="mt-6">
                      <Link to="/lab-tests">
                        Book Lab Test
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Orders;
