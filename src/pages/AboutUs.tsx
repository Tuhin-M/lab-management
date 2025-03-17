
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TopNavigation from "@/components/TopNavigation";
import { Award, Users, MapPin, CheckCircle, Heart, Clock, Target, Shield } from "lucide-react";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavigation activeModule="doctors" />
      
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              About Ekitsa
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Making healthcare accessible, affordable, and convenient for everyone
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => navigate("/signup")}>
                Join Us
              </Button>
              <Button variant="outline" onClick={() => navigate("/contact")}>
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
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
          </div>
          <div className="relative">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="Medical professionals"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-4 rounded-lg shadow-lg">
              <p className="font-bold text-xl">3+ Years</p>
              <p className="text-sm">of transforming healthcare</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-lg text-muted-foreground">
              We're guided by a clear purpose and strong principles that drive everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To make quality healthcare accessible to everyone by connecting patients with the right providers through technology
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To create a healthcare ecosystem where getting medical tests and doctor consultations is as easy as ordering food online
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Promise</h3>
              <p className="text-muted-foreground">
                To maintain the highest standards of quality, privacy, and customer service in everything we do
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <CheckCircle className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quality First</h3>
            <p className="text-muted-foreground">
              We partner only with accredited labs and verified doctors to ensure the highest standards of care
            </p>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <Users className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Patient-Centered</h3>
            <p className="text-muted-foreground">
              Everything we do is designed with the patient's needs, comfort, and convenience in mind
            </p>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <Award className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Transparency</h3>
            <p className="text-muted-foreground">
              We believe in clear communication, honest pricing, and no hidden charges
            </p>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <Clock className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
            <p className="text-muted-foreground">
              Making healthcare available to everyone, regardless of location or time constraints
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">
              Dedicated professionals working to transform healthcare delivery in India
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" 
                  alt="CEO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Rajesh Sharma</h3>
              <p className="text-primary mb-2">Co-founder & CEO</p>
              <p className="text-sm text-muted-foreground mb-4">
                Former healthcare consultant with 10+ years of experience in the industry
              </p>
              <div className="flex justify-center space-x-3">
                <a href="#" className="text-gray-500 hover:text-primary">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80" 
                  alt="CTO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Priya Mehta</h3>
              <p className="text-primary mb-2">Co-founder & CTO</p>
              <p className="text-sm text-muted-foreground mb-4">
                Tech leader with experience at top healthcare startups
              </p>
              <div className="flex justify-center space-x-3">
                <a href="#" className="text-gray-500 hover:text-primary">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                  alt="CMO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Dr. Arjun Singh</h3>
              <p className="text-primary mb-2">Chief Medical Officer</p>
              <p className="text-sm text-muted-foreground mb-4">
                Experienced physician with a passion for healthcare technology
              </p>
              <div className="flex justify-center space-x-3">
                <a href="#" className="text-gray-500 hover:text-primary">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-gray-300">Partner Labs</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">1000+</p>
              <p className="text-gray-300">Doctors</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">20+</p>
              <p className="text-gray-300">Cities</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">100K+</p>
              <p className="text-gray-300">Happy Patients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Locations */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Presence</h2>
          <p className="text-lg text-muted-foreground">
            Ekitsa is rapidly expanding across India to serve you better
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Our Locations
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Bangalore</h4>
                <p className="text-sm text-muted-foreground">Headquarters</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Mumbai</h4>
                <p className="text-sm text-muted-foreground">Regional Office</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Delhi</h4>
                <p className="text-sm text-muted-foreground">Regional Office</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Hyderabad</h4>
                <p className="text-sm text-muted-foreground">Regional Office</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Chennai</h4>
                <p className="text-sm text-muted-foreground">Coming Soon</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Kolkata</h4>
                <p className="text-sm text-muted-foreground">Coming Soon</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" className="w-full rounded-md border border-input p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full rounded-md border border-input p-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input type="text" className="w-full rounded-md border border-input p-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea rows={4} className="w-full rounded-md border border-input p-2 text-sm" />
              </div>
              <Button type="button">Send Message</Button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Ekitsa Community</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of our journey to transform healthcare in India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/signup")}>
              Sign Up Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/contact")}>
              Partner With Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>© 2023 Ekitsa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
