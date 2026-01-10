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
      <section className="relative -mt-12 z-20 container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                className="text-center group"
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex justify-center mb-3">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary group-hover:to-primary/80 transition-all duration-300 shadow-lg">
                    <stat.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Services Section - Bento Grid Style */}
      <section className="py-24 container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm px-5 py-1.5 rounded-full font-medium">Our Services</Badge>
          <h2 className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">Everything You Need</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">Complete healthcare at your fingertips. Book lab tests, consult doctors, and manage your health — all in one place.</p>
        </div>
        
        {/* Bento Grid Layout */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Featured Large Card - Lab Tests */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-[2.5rem] cursor-pointer md:row-span-2 h-[500px] md:h-auto shadow-2xl border border-white/20"
            onClick={() => navigate("/lab-tests")}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800)` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-600 via-cyan-500/80 to-transparent opacity-95" />
            
            <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
              <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl border border-white/30">
                <Microscope className="h-10 w-10" />
              </div>
              <Badge className="w-fit mb-3 bg-white/20 text-white border-0 backdrop-blur-md text-sm py-1.5 px-4">Most Popular</Badge>
              <h3 className="text-4xl md:text-5xl font-black mb-3 leading-tight">Lab Tests</h3>
              <p className="text-xl text-white/90 mb-6 max-w-md leading-relaxed">Book from 200+ tests with NABL certified labs. Get reports in just 6 hours with free home collection.</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-lg font-bold bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl group-hover:bg-white group-hover:text-cyan-600 transition-all duration-300">
                  <span>Explore Tests</span>
                  <ChevronRight className="h-6 w-6 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
                <div className="text-white/70 text-sm">Starting at ₹199</div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Stacked Cards */}
          <div className="flex flex-col gap-6">
            {/* Doctor Consult Card */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden rounded-[2rem] cursor-pointer h-60 shadow-xl border border-white/20"
              onClick={() => navigate("/doctors")}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500/90 to-transparent opacity-95" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg border border-white/30">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <h3 className="text-3xl font-extrabold mb-2">Doctor Consult</h3>
                <p className="text-base text-white/90 mb-4 max-w-sm">500+ verified specialists available online. Get expert advice from the comfort of your home.</p>
                <div className="flex items-center text-base font-bold group-hover:gap-2 transition-all">
                  <span>Book Now</span>
                  <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
            
            {/* Health Packages Card */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden rounded-[2rem] cursor-pointer h-60 shadow-xl border border-white/20"
              onClick={() => navigate("/lab-tests")}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500/90 to-transparent opacity-95" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg border border-white/30">
                  <HeartPulse className="h-7 w-7" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-3xl font-extrabold">Health Packages</h3>
                  <Badge className="bg-white/20 text-white border-0 text-sm">Popular</Badge>
                </div>
                <p className="text-base text-white/90 mb-4 max-w-sm">Full body checkups starting at just ₹999. Comprehensive health monitoring made affordable.</p>
                <div className="flex items-center text-base font-bold group-hover:gap-2 transition-all">
                  <span>View Packages</span>
                  <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Offers Section - Dark */}
      <section className="py-16 bg-gray-900 text-white relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" 
        />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between mb-10">
            <div>
              <Badge className="mb-2 bg-primary/20 text-primary border-primary/30 text-sm px-4 py-1">Limited Time</Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold">Exclusive Offers</h2>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
            {offers.map((offer, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                className="relative overflow-hidden rounded-2xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${offer.color} opacity-20 blur-3xl group-hover:opacity-30 transition-opacity`} />
                <div className="relative flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${offer.color} flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300 shadow-lg`}>
                    <Percent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl font-extrabold">{offer.discount}</span>
                      <Badge variant="secondary" className="text-xs bg-white/10 border-0 px-3 py-1">{offer.code}</Badge>
                    </div>
                    <p className="text-sm text-gray-300">{offer.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 text-sm px-4 py-1">Why Ekitsa</Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">The Smart Choice</h2>
          <p className="text-muted-foreground text-lg">Features that set us apart</p>
        </div>
        
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -8 }}
              className="group text-center p-6 rounded-2xl border bg-card/80 backdrop-blur-md hover:shadow-2xl hover:border-primary/20 transition-all duration-300"
            >
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4 group-hover:from-primary group-hover:to-primary/80 transition-all duration-300 shadow-lg">
                <feature.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <div className="text-2xl font-extrabold text-primary mb-1">{feature.stat}</div>
              <h3 className="font-bold text-base mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 text-sm px-4 py-1">Testimonials</Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">Loved by Thousands</h2>
            <p className="text-muted-foreground text-lg">See what our customers have to say</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card/80 backdrop-blur-md border rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star 
                      key={j} 
                      className={`h-5 w-5 ${j < t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-base text-muted-foreground mb-5 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center font-bold text-sm text-white shadow-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-base">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-cyan-600 text-white overflow-hidden relative">
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
           <Zap className="h-12 w-12 mx-auto mb-4 opacity-90" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Start Your Health Journey</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Join 10,000+ users who trust Ekitsa for quality healthcare
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-bold h-14 px-8 rounded-2xl shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95 text-lg"
              onClick={() => navigate("/lab-tests")}
            >
              Book Lab Test
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10 h-14 px-8 rounded-2xl transition-all hover:scale-105 active:scale-95 text-lg"
            >
              <Phone className="mr-2 h-5 w-5" />
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
