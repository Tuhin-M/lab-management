
import React from "react";
import { useNavigate } from "react-router-dom";
import { Award, Users, MapPin, CheckCircle, Heart, Clock, Target, Shield } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16">
      
      {/* Hero Section */}
      <section className="bg-primary/5 py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Transforming Healthcare <br />
              <span className="text-primary italic">for Everyone</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Ekitsa is on a mission to make quality healthcare accessible, 
              affordable, and convenient through cutting-edge technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20" onClick={() => navigate("/signup")}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl px-8 h-12 text-base font-semibold bg-white/50 backdrop-blur-sm" onClick={() => navigate("/contact")}>
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Empowering Patients <br />Since 2020</h2>
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
                Today, Ekitsa serves thousands of patients across major Indian cities, partnering with NABL-accredited labs and verified specialists to deliver a seamless healthcare experience.
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
              <p className="font-bold text-4xl text-primary mb-1">3+ Years</p>
              <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">of Innovation</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
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
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-sm border border-primary/5 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-2 group">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To make quality healthcare accessible to everyone by connecting patients with the right providers through technology.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-sm border border-primary/5 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-2 group">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 -rotate-3 group-hover:rotate-0 transition-transform">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To create a healthcare ecosystem where getting medical tests is as easy as ordering something online.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-sm border border-primary/5 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-2 group">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 rotate-6 group-hover:rotate-0 transition-transform">
                <Shield className="h-10 w-10 text-primary" />
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
      <section className="py-24 container mx-auto px-4">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: CheckCircle, title: "Quality First", desc: "We partner only with accredited labs and verified doctors." },
            { icon: Users, title: "Patient-Centered", desc: "Designed with the patient's needs and convenience in mind." },
            { icon: Award, title: "Transparency", desc: "No hidden charges, clear communication, and honest pricing." },
            { icon: Shield, title: "Data Security", desc: "Your health records are encrypted and kept 100% confidential." }
          ].map((value, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 border-2 border-slate-50 dark:border-slate-800 rounded-3xl hover:border-primary/20 hover:bg-primary/5 transition-all group"
            >
              <value.icon className="h-12 w-12 text-primary mb-6 transition-transform group-hover:scale-110" />
              <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">50k+</p>
              <p className="font-medium opacity-80 uppercase tracking-wider text-sm">Happy Patients</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">200+</p>
              <p className="font-medium opacity-80 uppercase tracking-wider text-sm">Partner Labs</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">500+</p>
              <p className="font-medium opacity-80 uppercase tracking-wider text-sm">Specialists</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">15+</p>
              <p className="font-medium opacity-80 uppercase tracking-wider text-sm">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Better Healthcare?</h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join thousands of users who trust Ekitsa for their diagnostic 
          and consultation needs.
        </p>
        <Button size="lg" className="rounded-xl px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20" onClick={() => navigate("/signup")}>
          Get Started Now
        </Button>
      </section>

      {/* Footer */}

    </div>
  );
};

export default AboutUs;
