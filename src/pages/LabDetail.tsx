import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Star, 
  Award, 
  ArrowLeft, 
  Calendar, 
  CheckSquare, 
  ShieldCheck, 
  BadgePercent
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Test } from "@/components/TestResult";
import { Lab } from "@/components/LabCard";
import { TestPackage } from "@/components/TestPackage";
import TestPackageComponent from "@/components/TestPackage";
import { useToast } from "@/components/ui/use-toast";
import LabTestSearch from "@/components/LabTestSearch";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data for Test Packages
const mockTestPackages: TestPackage[] = [
  {
    id: "1",
    name: "Complete Health Checkup",
    description: "Comprehensive health assessment with over 70+ essential tests",
    price: 4999,
    discount: 30,
    tests: [
      "Complete Blood Count",
      "Lipid Profile",
      "Liver Function Test",
      "Kidney Function Test",
      "Thyroid Profile",
      "Vitamin D, B12",
      "HbA1c",
    ],
    includedTestCount: 72,
    isPopular: true,
    category: "Comprehensive",
    imageUrl: "https://images.unsplash.com/photo-1631815590058-860e4f83c4b1?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Women's Health Checkup",
    description: "Essential tests designed specifically for women's health",
    price: 3499,
    discount: 20,
    tests: [
      "Complete Blood Count",
      "Thyroid Profile",
      "Vitamin D, B12, Calcium",
      "PCOD/PCOS Panel",
      "Pap Smear",
    ],
    includedTestCount: 45,
    category: "Women's Health",
    imageUrl: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Diabetes Screening",
    description: "Comprehensive tests to diagnose and monitor diabetes",
    price: 1999,
    discount: 15,
    tests: [
      "Fasting Blood Sugar",
      "Post Prandial Blood Sugar",
      "HbA1c",
      "Insulin Level",
      "Kidney Function Test",
    ],
    includedTestCount: 12,
    category: "Diabetes",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Heart Health Checkup",
    description: "Essential tests to assess cardiovascular health",
    price: 2499,
    discount: 10,
    tests: [
      "Lipid Profile",
      "ECG",
      "Cardiac Risk Markers",
      "Complete Blood Count",
      "Vitamin D",
    ],
    includedTestCount: 18,
    isPopular: true,
    category: "Cardiac",
    imageUrl: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2070&auto=format&fit=crop",
  }
];

// Mock additional tests
const recommendedTests: Test[] = [
  {
    id: "7",
    name: "Vitamin B12",
    description: "Measures the level of vitamin B12 in your blood",
    category: "Nutrition",
    price: 899,
    discount: 10,
  },
  {
    id: "8",
    name: "Vitamin D3",
    description: "Measures the amount of vitamin D in your blood",
    category: "Nutrition",
    price: 1299,
    discount: 15,
    isPopular: true,
  },
  {
    id: "9",
    name: "CRP Test",
    description: "Measures C-reactive protein levels to detect inflammation",
    category: "Inflammation",
    price: 699,
  },
  {
    id: "10",
    name: "Full Body Checkup",
    description: "Comprehensive assessment of overall health",
    category: "Preventive",
    price: 2999,
    discount: 20,
    isPopular: true,
  },
];

interface LabDetailsProps {
  selectedLab?: Lab;
  selectedTest?: Test;
}

const LabDetail = ({ selectedLab, selectedTest }: LabDetailsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams<{ labId: string }>();
  const [selectedTab, setSelectedTab] = useState("overview");
  
  const lab = selectedLab || {
    id: "1",
    name: "LifeCare Diagnostics",
    address: "123, Koramangala, Bengaluru, Karnataka 560034",
    distance: 1.2,
    rating: 4.7,
    reviewCount: 142,
    price: 699,
    discount: 20,
    waitTime: "10-15 min",
    openNow: true,
    facilities: ["Home Collection", "Digital Reports", "NABL Accredited", "Insurance Accepted"],
    imageUrl: "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?q=80&w=2070&auto=format&fit=crop",
    accreditation: "NABL Accredited Lab",
    yearEstablished: 2005,
  };
  
  const test = selectedTest || {
    id: "1",
    name: "Complete Blood Count (CBC)",
    description: "Measures red and white blood cells, platelets, and hemoglobin",
    category: "Hematology",
    price: 699,
    discount: 20,
  };
  
  const discountedPrice = lab.discount 
    ? Math.round(test.price! - (test.price! * lab.discount / 100)) 
    : test.price;
  
  const handleBookAppointment = () => {
    navigate(`/test-booking/${test.id}`, { 
      state: { lab, test, price: discountedPrice }
    });
  };
  
  const handlePackageSelect = (testPackage: TestPackage) => {
    toast({
      title: "Package Selected",
      description: `You selected ${testPackage.name}`,
    });
  };
  
  const handleTestSelect = (test: Test) => {
    toast({
      title: "Test Added",
      description: `${test.name} added to your selection`,
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              <img 
                src="/lovable-uploads/08ef7f9d-005e-4c81-a1b5-1420f8ce4d9b.png" 
                alt="Ekitsa Logo" 
                className="h-8" 
              />
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button>Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search Results
        </Button>
        
        {/* Lab Header */}
        <div 
          className="h-64 rounded-xl bg-cover bg-center w-full mb-6 relative" 
          style={{ backgroundImage: `url(${lab.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl">
            <div className="absolute bottom-0 p-6 text-white">
              <h1 className="text-3xl font-bold">{lab.name}</h1>
              <div className="flex items-center mt-2">
                <MapPin className="h-4 w-4 mr-2" />
                <p>{lab.address}</p>
              </div>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                  <span>{lab.rating.toFixed(1)}</span>
                  <span className="text-gray-300 ml-1">({lab.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{lab.openNow ? 'Open Now' : 'Closed'}</span>
                </div>
                {lab.accreditation && (
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    <span>{lab.accreditation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Lab Details */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs 
              defaultValue="overview" 
              className="w-full"
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tests">Tests & Packages</TabsTrigger>
                <TabsTrigger value="testSearch">Test Search</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="bg-card rounded-lg border p-6 space-y-4">
                  <h2 className="text-xl font-semibold">About {lab.name}</h2>
                  <p className="text-muted-foreground">
                    {lab.name} is a premier diagnostic center established in {lab.yearEstablished}, offering 
                    a comprehensive range of laboratory tests with state-of-the-art technology and 
                    experienced pathologists. We are committed to providing accurate, timely, and 
                    affordable diagnostic services.
                  </p>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Facilities & Services</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {lab.facilities.map((facility, i) => (
                        <div key={i} className="flex items-center">
                          <CheckSquare className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>+91 98765 43210</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>contact@lifecarediagnostics.in</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>Open: 7:00 AM - 9:00 PM (Monday - Sunday)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="text-xl font-semibold mb-4">Selected Test</h2>
                  
                  <div className="flex items-start justify-between border-b pb-4 mb-4">
                    <div>
                      <h3 className="font-medium">{test.name}</h3>
                      <p className="text-sm text-muted-foreground">{test.description}</p>
                      <Badge variant="outline" className="mt-2">
                        {test.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      {lab.discount ? (
                        <div>
                          <p className="text-sm line-through text-muted-foreground">₹{test.price}</p>
                          <div className="flex items-center text-primary">
                            <BadgePercent className="h-3 w-3 mr-1" />
                            <span className="text-xs">{lab.discount}% off</span>
                          </div>
                          <p className="font-bold text-lg text-primary">₹{discountedPrice}</p>
                        </div>
                      ) : (
                        <p className="font-bold text-lg">₹{test.price}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Report Time</h3>
                      <p className="text-sm text-muted-foreground">Available within 24 hours</p>
                    </div>
                    <Button onClick={handleBookAppointment} className="bg-primary hover:bg-primary/90">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tests" className="space-y-6 mt-6">
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="text-xl font-semibold mb-4">Available Packages</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockTestPackages.map((testPackage) => (
                      <TestPackageComponent
                        key={testPackage.id}
                        testPackage={testPackage}
                        onSelect={handlePackageSelect}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Recommended Tests</h2>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Popular
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendedTests.map((test) => (
                      <div key={test.id} className="border rounded-lg p-4 flex justify-between">
                        <div>
                          <h3 className="font-medium">{test.name}</h3>
                          <p className="text-sm text-muted-foreground">{test.description}</p>
                          <Badge variant="outline" className="mt-1">
                            {test.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          {test.discount ? (
                            <div>
                              <p className="text-sm line-through text-muted-foreground">₹{test.price}</p>
                              <p className="text-xs text-primary">{test.discount}% off</p>
                              <p className="font-bold">
                                ₹{Math.round(test.price! - (test.price! * test.discount / 100))}
                              </p>
                              <Button 
                                size="sm" 
                                className="mt-2 bg-primary hover:bg-primary/90" 
                                onClick={() => handleTestSelect(test)}
                              >
                                Add
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <p className="font-bold">₹{test.price}</p>
                              <Button 
                                size="sm" 
                                className="mt-2 bg-primary hover:bg-primary/90" 
                                onClick={() => handleTestSelect(test)}
                              >
                                Add
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="testSearch" className="mt-6">
                <LabTestSearch />
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                  
                  <div className="mb-6 flex items-center">
                    <div className="mr-6">
                      <p className="text-4xl font-bold">{lab.rating.toFixed(1)}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(lab.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{lab.reviewCount} reviews</p>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="space-y-1">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center">
                            <span className="text-sm w-6">{rating}</span>
                            <div className="flex-grow mx-2 bg-secondary h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-primary h-full" 
                                style={{ 
                                  width: `${Math.random() * (rating === 5 ? 100 : 50)}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground w-8">
                              {Math.floor(Math.random() * (rating === 5 ? 100 : 30))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Mock reviews */}
                    {[
                      {
                        name: "Priya Sharma",
                        rating: 5,
                        date: "2 weeks ago",
                        comment: "Excellent service! The staff was very professional and the reports were delivered on time. The home collection service made it very convenient."
                      },
                      {
                        name: "Rahul Kumar",
                        rating: 4,
                        date: "1 month ago",
                        comment: "Good experience overall. The lab is very clean and well-maintained. The technicians are skilled and the process was smooth."
                      },
                      {
                        name: "Ananya Patel",
                        rating: 5,
                        date: "2 months ago",
                        comment: "Highly recommended! The digital reports feature is very convenient, and the prices are reasonable compared to other labs in the area."
                      }
                    ].map((review, i) => (
                      <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <p className="font-medium">{review.name}</p>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex my-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill="currentColor" 
                            />
                          ))}
                        </div>
                        <p className="text-sm mt-1">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">View All Reviews</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column - Map and Details */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6 sticky top-24">
              <h3 className="font-semibold mb-3">Book Your Test</h3>
              
              <div className="space-y-4">
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Selected Test</span>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {test.category}
                    </Badge>
                  </div>
                  <p className="font-medium">{test.name}</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Test Price</span>
                    <span>₹{test.price}</span>
                  </div>
                  {lab.discount && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm flex items-center text-primary">
                        <BadgePercent className="h-3 w-3 mr-1" />
                        Discount
                      </span>
                      <span className="text-primary">- ₹{test.price! - discountedPrice}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-lg">₹{discountedPrice}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-primary" />
                    <span>Report in 24 hours</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <ShieldCheck className="h-4 w-4 mr-1 text-primary" />
                    <span>Secure Payment</span>
                  </div>
                </div>
                
                <Button onClick={handleBookAppointment} className="w-full bg-primary hover:bg-primary/90">
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto py-6 px-4 md:flex justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/08ef7f9d-005e-4c81-a1b5-1420f8ce4d9b.png" 
              alt="Ekitsa Logo" 
              className="h-8 mx-auto md:mx-0 mb-2" 
            />
            <p className="text-sm text-muted-foreground">
              © 2023 Ekitsa. All rights reserved.
            </p>
          </div>
          <div className="flex justify-center md:justify-end space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LabDetail;
