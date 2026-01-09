import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  TestTube, 
  ArrowRight, 
  Clock, 
  Shield, 
  Home, 
  FileText, 
  Star, 
  Percent, 
  HeartPulse,
  Microscope,
  Stethoscope,
  BadgePercent,
  Zap,
  Phone,
  ChevronRight,
  Sparkles,
  MapPin,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/SearchBar";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  
  const handleHomeSearch = (query: string, category?: string) => {
    if (category === "doctors") {
      navigate(`/doctors?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/lab-tests?search=${encodeURIComponent(query)}`);
    }
  };

  const features = [
    { icon: Home, title: "Home Collection", description: "Samples collected at your doorstep", stat: "60 min" },
    { icon: Clock, title: "Quick Reports", description: "Reports within 6-24 hours", stat: "6 hrs" },
    { icon: Shield, title: "NABL Certified", description: "All labs are certified", stat: "100%" },
    { icon: FileText, title: "Digital Reports", description: "Access reports anytime", stat: "24/7" },
  ];

  const stats = [
    { value: "50+", label: "Partner Labs", icon: Microscope },
    { value: "200+", label: "Tests Available", icon: TestTube },
    { value: "10K+", label: "Happy Patients", icon: HeartPulse },
    { value: "4.8", label: "User Rating", icon: Star },
  ];

  const services = [
    { 
      icon: Microscope, 
      title: "Lab Tests", 
      description: "Blood tests, health packages & diagnostics",
      path: "/lab-tests",
      color: "from-cyan-400 to-blue-600",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400"
    },
    { 
      icon: Stethoscope, 
      title: "Doctor Consult", 
      description: "500+ verified specialists online",
      path: "/doctors",
      color: "from-cyan-400 to-blue-600",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
    },
    { 
      icon: HeartPulse, 
      title: "Health Packages", 
      description: "Full body checkups from ₹999",
      path: "/lab-tests",
      color: "from-cyan-400 to-blue-600",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=400"
    },
  ];

  const offers = [
    { code: "HEALTH20", discount: "20% OFF", description: "On first lab test", validTill: "31 Jan", color: "from-emerald-500 to-teal-600" },
    { code: "FULLBODY", discount: "₹999", description: "Full Body Checkup", validTill: "Limited", color: "from-blue-500 to-indigo-600" },
    { code: "FREEDOC", discount: "FREE", description: "Doctor consult", validTill: "Today", color: "from-amber-500 to-orange-600" },
  ];

  const testimonials = [
    { name: "Priya S.", rating: 5, text: "Got reports in 6 hours! Home collection was super convenient.", location: "Bengaluru", avatar: "PS" },
    { name: "Rahul M.", rating: 5, text: "Saved ₹500 by comparing prices. Great app!", location: "Koramangala", avatar: "RM" },
    { name: "Anita K.", rating: 5, text: "Booking doctors is so easy. Highly recommend.", location: "Indiranagar", avatar: "AK" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col overflow-hidden relative selection:bg-primary/20">
      {/* Background Gradients & Patterns */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] opacity-60" />
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-16 relative z-10" />
      
      {/* Hero Section - Dark with Background Image */}
      <section className="relative min-h-[500px] flex items-center bg-black text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=2000')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        {/* Animated Gradient Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 left-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-[80px]" 
        />
        
        <div className="container mx-auto px-4 relative z-10 py-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge className="mb-3 bg-white/10 text-primary border-primary/30 px-3 py-1 backdrop-blur-sm text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Trusted by 10,000+ patients
              </Badge>
              
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 leading-tight">
                Your Health,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary">Our Priority</span>
              </h1>
              
              <p className="text-sm md:text-base text-gray-300 mb-6 max-w-lg">
                Book lab tests, consult doctors, and manage your family's health - all in one platform. NABL certified labs. Digital reports.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8 w-full max-w-xl"
            >
              <SearchBar 
                onSearch={handleHomeSearch}
                placeholder="Search for blood tests, health packages..."
                context="lab"
                animated={true}
              />
            </motion.div>
            
            {/* Quick Action Buttons - Modern Search Alternative */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-3 mb-6"
            >
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-black font-semibold h-11 px-6 rounded-xl group transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                onClick={() => navigate("/lab-tests")}
              >
                <Search className="mr-2 h-4 w-4" />
                Book Lab Test
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-11 px-6 rounded-xl backdrop-blur-sm transition-all hover:scale-105"
                onClick={() => navigate("/doctors")}
              >
                <Stethoscope className="mr-2 h-4 w-4" />
                Find Doctors
              </Button>
            </motion.div>
            
            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { label: "NABL Certified", icon: Shield },
                { label: "Home Collection", icon: Home },
                { label: "6 Hr Reports", icon: Clock },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-gray-400 text-xs bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-default">
                  <item.icon className="h-3 w-3 text-primary" />
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section with Pop-up Animation */}
      <section className="relative -mt-10 z-20 container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-5 border"
        >
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                className="text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex justify-center mb-1">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <stat.icon className="h-4 w-4 text-primary group-hover:text-white transition-colors" />
                  </div>
                </div>
                <div className="text-lg md:text-xl font-bold text-foreground">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Services Section with Image Cards */}
      <section className="py-12 container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-2 text-xs">Our Services</Badge>
          <h2 className="text-2xl font-bold mb-1">Everything You Need</h2>
          <p className="text-muted-foreground text-sm">Complete healthcare at your fingertips</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
          {services.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-xl cursor-pointer h-56 shadow-md hover:shadow-xl transition-all duration-300"
              onClick={() => navigate(service.path)}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${service.image})` }}
              />
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-0.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{service.title}</h3>
                <p className="text-xs text-white/80 mb-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">{service.description}</p>
                <div className="flex items-center text-xs font-medium group-hover:gap-1 transition-all">
                  <span>Explore</span>
                  <ChevronRight className="h-3 w-3 ml-0.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Offers Section - Dark */}
      <section className="py-10 bg-gray-900 text-white relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" 
        />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Badge className="mb-1 bg-primary/20 text-primary border-primary/30 text-xs">Limited Time</Badge>
              <h2 className="text-xl font-bold">Exclusive Offers</h2>
            </div>
          </div>
          
          <div className="grid gap-3 md:grid-cols-3">
            {offers.map((offer, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-xl p-4 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${offer.color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />
                <div className="relative flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${offer.color} flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300`}>
                    <Percent className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-lg font-bold">{offer.discount}</span>
                      <Badge variant="secondary" className="text-[9px] bg-white/10 border-0 h-4">{offer.code}</Badge>
                    </div>
                    <p className="text-xs text-gray-400">{offer.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-2 text-xs">Why Ekitsa</Badge>
          <h2 className="text-2xl font-bold mb-1">The Smart Choice</h2>
          <p className="text-muted-foreground text-sm">Features that set us apart</p>
        </div>
        
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="group text-center p-4 rounded-xl border bg-card hover:shadow-lg transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-3 group-hover:from-primary group-hover:to-primary/80 transition-colors">
                <feature.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
              </div>
              <div className="text-lg font-bold text-primary mb-0.5">{feature.stat}</div>
              <h3 className="font-semibold text-sm mb-0.5">{feature.title}</h3>
              <p className="text-[10px] text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <Badge variant="secondary" className="mb-2 text-xs">Testimonials</Badge>
            <h2 className="text-2xl font-bold mb-1">Loved by Thousands</h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card border rounded-xl p-4 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star 
                      key={j} 
                      className={`h-3 w-3 ${j < t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center font-bold text-[10px] text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-xs">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground">{t.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-cyan-600 text-white overflow-hidden relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <motion.div
             animate={{ rotate: [0, 10, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="inline-block"
          >
           <Zap className="h-8 w-8 mx-auto mb-3 opacity-80" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Start Your Health Journey</h2>
          <p className="text-sm opacity-90 mb-5 max-w-md mx-auto">
            Join 10,000+ users who trust Ekitsa for quality healthcare
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              size="default" 
              className="bg-white text-primary hover:bg-white/90 font-semibold h-10 px-6 rounded-xl shadow-lg shadow-black/10 transition-transform hover:scale-105 active:scale-95"
              onClick={() => navigate("/lab-tests")}
            >
              Book Lab Test
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="default" 
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10 h-10 px-6 rounded-xl transition-transform hover:scale-105 active:scale-95"
            >
              <Phone className="mr-2 h-4 w-4" />
              1800-123-4567
            </Button>
          </div>
        </motion.div>
        
        {/* Background blobs for CTA */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"
        />
      </section>
    </div>
  );
};

export default Index;
