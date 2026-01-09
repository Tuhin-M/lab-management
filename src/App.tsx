import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from "react";
import GlobalNavbar from "./components/GlobalNavbar";
import LoadingFallback from "@/utils/LoadingFallback";
import { isLabOwnerRoute } from "@/utils/routeUtils";
import SingleLabDashboard from "./components/lab-owner/SingleLabDashboard";
import Footer from "./components/Footer";
const LabDashboard = lazy(() => import("./pages/lab-owner/LabDashboard"));

// All pages are now lazy-loaded for consistency and performance
const Home = lazy(() => import("./pages/Home"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const DoctorAppointment = lazy(() => import("./pages/DoctorAppointment"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Blog = lazy(() => import("./pages/Blog"));
const LabTests = lazy(() => import("./pages/LabTests"));
const LabDetail = lazy(() => import("./pages/LabDetail"));
const TestBooking = lazy(() => import("./pages/TestBooking"));
const Index = lazy(() => import("./pages/Index"));
const Orders = lazy(() => import("./pages/Orders"));
const AddLab = lazy(() => import("./pages/lab-owner/AddLab"));
const LabOwnerLabDetail = lazy(() => import("./pages/lab-owner/LabDetail"));
const AddTest = lazy(() => import("./pages/lab-owner/AddTest"));
const DoctorChat = lazy(() => import("./pages/DoctorChat"));
const HealthRecords = lazy(() => import("./pages/HealthRecords"));
const LabComparison = lazy(() => import("./pages/LabComparison"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  // Initialize React Query client
  const queryClient = new QueryClient();
  // Show global navbar on lab-dashboard as well
  
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalNavbar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          {/* Remove Home component and redirect /home to / */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/doctors" element={<DoctorAppointment />} />
          <Route path="/doctors/:id" element={<DoctorAppointment />} />
          <Route path="/doctor-chat/:id" element={<DoctorChat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/lab-tests" element={<LabTests />} />
          <Route path="/compare-labs" element={<LabComparison />} />
          <Route path="/orders" element={<Orders />} />

          {/* Lab Owner Routes */}
          <Route path="/lab-dashboard" element={<LabDashboard />} />
          <Route path="/lab-owner" element={<LabDashboard />} />
          <Route path="/lab-owner/labs/:labId" element={<SingleLabDashboard />} />
          <Route path="/lab-owner/add-lab" element={<AddLab />} />
          <Route path="/lab-owner/edit-lab/:id" element={<AddLab />} />
          <Route path="/lab-owner/lab/:id" element={<LabOwnerLabDetail />} />
          <Route path="/lab-owner/lab/:id/appointments" element={<LabOwnerLabDetail />} />
          <Route path="/lab-owner/lab/:id/tests" element={<LabOwnerLabDetail />} />
          <Route path="/lab-owner/:labId/add-test" element={<AddTest />} />

          {/* Add redirects for potential path mismatches */}
          <Route path="/labs" element={<Navigate to="/lab-tests" replace />} />
          <Route path="/lab/:id" element={<LabDetail />} />
          <Route path="/labs/:id" element={<LabDetail />} />
          <Route path="/test-booking/:id" element={<TestBooking />} />
          <Route path="/health-records" element={<HealthRecords />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
      <Footer />
    </QueryClientProvider>
  );
}

export default App;
