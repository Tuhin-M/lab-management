
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

// Fallback component for lazy-loaded routes
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      <p className="text-lg font-medium">Loading...</p>
    </div>
  </div>
);

// Lazy-loaded pages
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
import HealthRecords from "./pages/HealthRecords";

function App() {
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/doctors/:id" element={<DoctorAppointment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/lab-tests" element={<LabTests />} />
          <Route path="/labs/:id" element={<LabDetail />} />
          <Route path="/test-booking/:id" element={<TestBooking />} />
          <Route path="/health-records" element={<HealthRecords />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md">
        Go Home
      </a>
    </div>
  );
}

export default App;
