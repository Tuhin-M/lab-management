import React from "react";
import { useNavigate } from "react-router-dom";
import { Award, Users, MapPin, CheckCircle, Heart, Clock, Target, Shield, Linkedin, Twitter, Mail, Briefcase, Code2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const AboutUs = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Team members data
  const teamMembers = [
    {
      name: "Avishek Das",
      role: "Founder",
      department: "Deals & Marketing",
      description: "Drives business growth, partnerships, and marketing strategy. Responsible for building relationships with labs and healthcare providers.",
      icon: TrendingUp,
      gradient: "from-orange-500 to-rose-500",
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Avishek35&backgroundColor=b6e3f4"
    },
    {
      name: "Tuhin Majumdar",
      role: "Co-Founder",
      department: "Technology",
      description: "Leads product development and architecture. Building scalable solutions to transform healthcare delivery through technology.",
      icon: Code2,
      gradient: "from-blue-500 to-cyan-500",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Tuhin&backgroundColor=c0aede"
    },
    {
      name: "Haris Patel",
      role: "Co-Founder", 
      department: "Technology",
      description: "Oversees technical infrastructure and engineering teams. Focused on building secure, reliable, and user-friendly healthcare platforms.",
      icon: Code2,
      gradient: "from-purple-500 to-pink-500",
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Haris30&backgroundColor=d1d5db"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] opacity-60" />
      </div>

      {/* Dark Hero Section - Matching Home Page */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000')" }}
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-20 w-72 h-72 bg-primary/30 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6"
            >
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Caring for India's Health</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Transforming Healthcare
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary">
                for Everyone
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Ekitsa is on a mission to make quality healthcare accessible, 
              affordable, and convenient through cutting-edge technology.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-primary/30 bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90" 
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-xl px-8 h-12 text-base font-semibold bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" 
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Journey</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Empowering Patients <br/>Since 2020</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Founded in 2020, Ekitsa was born from a simple yet powerful idea: healthcare should be accessible to everyone, everywhere.
              </p>
              <p>
                Our founders experienced firsthand the challenges of navigating India's fragmented healthcare system - from finding reliable diagnostic centers to booking appointments with trusted doctors.
              </p>
              <p>
                This personal experience fueled our mission to build a platform that connects patients with quality healthcare providers while ensuring transparency, affordability, and convenience.
              </p>
              <p>
                Today, Ekitsa serves thousands of patients across major Indian cities, partnering with NABL-accredited labs and verified specialists.
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] bg-primary/10 rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="Medical professionals"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-6 lg:-right-10 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl z-20 border border-primary/10">
              <p className="font-bold text-4xl text-primary mb-1">5+ Years</p>
              <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">of Innovation</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">The Leaders</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground">
              Three passionate founders with equal vision, driving Ekitsa's mission to transform healthcare in India.
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {teamMembers.map((member, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants} 
                className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-all hover:shadow-2xl hover:-translate-y-2 group"
              >
                {/* Avatar */}
                <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${member.gradient} p-1 mb-6 group-hover:scale-110 transition-transform`}>
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Info */}
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary font-semibold mb-2">{member.role}</p>
                <div className="flex items-center gap-2 mb-4">
                  <member.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">{member.department}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {member.description}
                </p>
                
                {/* Social Links */}
                <div className="flex gap-3 mt-6">
                  <a href="#" className="p-2 rounded-lg bg-gray-100 hover:bg-primary/10 hover:text-primary transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="#" className="p-2 rounded-lg bg-gray-100 hover:bg-primary/10 hover:text-primary transition-colors">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="#" className="p-2 rounded-lg bg-gray-100 hover:bg-primary/10 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
          

        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our DNA</h2>
            <p className="text-xl text-muted-foreground">
              We're guided by a clear purpose and strong principles that drive everything we do.
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="bg-white p-10 rounded-3xl shadow-sm border border-primary/5 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-2 group">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To make quality healthcare accessible to everyone by connecting patients with the right providers through technology.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white p-10 rounded-3xl shadow-sm border border-primary/5 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-2 group">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center mb-8 -rotate-3 group-hover:rotate-0 transition-transform">
                <Heart className="h-10 w-10 text-cyan-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To create a healthcare ecosystem where getting medical tests is as easy as ordering something online.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white p-10 rounded-3xl shadow-sm border border-primary/5 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-2 group">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-8 rotate-6 group-hover:rotate-0 transition-transform">
                <Shield className="h-10 w-10 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Promise</h3>
              <p className="text-muted-foreground leading-relaxed">
                To maintain the highest standards of quality, privacy, and customer service in everything we do.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 container mx-auto px-4 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-cyan-500 mx-auto rounded-full" />
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: CheckCircle, title: "Quality First", desc: "We partner only with accredited labs and verified doctors.", color: "text-green-500" },
            { icon: Users, title: "Patient-Centered", desc: "Designed with the patient's needs and convenience in mind.", color: "text-blue-500" },
            { icon: Award, title: "Transparency", desc: "No hidden charges, clear communication, and honest pricing.", color: "text-orange-500" },
            { icon: Shield, title: "Data Security", desc: "Your health records are encrypted and kept 100% confidential.", color: "text-purple-500" }
          ].map((value, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 bg-white border border-gray-100 rounded-3xl hover:border-primary/20 hover:shadow-xl transition-all group"
            >
              <value.icon className={`h-12 w-12 ${value.color} mb-6 transition-transform group-hover:scale-110`} />
              <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50k+", label: "Happy Patients" },
              { value: "200+", label: "Partner Labs" },
              { value: "500+", label: "Specialists" },
              { value: "15+", label: "Cities Covered" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <p className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">{stat.value}</p>
                <p className="font-medium opacity-80 uppercase tracking-wider text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Better Healthcare?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust Ekitsa for their diagnostic 
            and consultation needs.
          </p>
          <Button 
            size="lg" 
            className="rounded-xl px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20 bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90" 
            onClick={() => navigate("/signup")}
          >
            Get Started Now
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
