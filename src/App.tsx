
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import LabTests from "./pages/LabTests";
import LabDetail from "./pages/LabDetail";
import TestBooking from "./pages/TestBooking";
import DoctorAppointment from "./pages/DoctorAppointment";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/labs" element={<LabTests />} />
          <Route path="/lab/:labId" element={<LabDetail />} />
          <Route path="/test-booking" element={<TestBooking />} />
          <Route path="/doctors" element={<DoctorAppointment />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
