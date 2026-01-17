import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
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
  BadgePercent,
  Plus,
  Loader2,
  X
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Test } from "@/components/TestResult";
import { Lab } from "@/components/LabCard";
import { useToast } from "@/components/ui/use-toast";
import LabTestSearch from "@/components/LabTestSearch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { labsAPI, authAPI, labOwnerAPI } from "@/services/api";

const LabDetail = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const [lab, setLab] = useState<any>(location.state?.lab || null);
  // Support multiple test selection
  const [selectedTests, setSelectedTests] = useState<any[]>(
    location.state?.test ? [location.state.test] : []
  );
  const [loading, setLoading] = useState(!lab);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isOwner, setIsOwner] = useState(false);
  const isLabOwner = authAPI.getCurrentUserRole() === "lab_owner";

  useEffect(() => {
    const fetchLabData = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const labData = await labsAPI.getLabById(params.id);
        setLab(labData);

        // Check ownership if user is a lab owner
        if (isLabOwner) {
          const ownedLabs = await labOwnerAPI.getOwnedLabs();
          const labsList = ownedLabs.data ?? ownedLabs;
          setIsOwner(labsList.some((l: any) => l.id === params.id));
        }

        // If no test was passed in state, pick the first one from the lab
        if (selectedTests.length === 0 && labData.tests && labData.tests.length > 0) {
          setSelectedTests([{
            id: labData.tests[0].id,
            name: labData.tests[0].name,
            description: labData.tests[0].description,
            category: labData.tests[0].category?.name || "General",
            price: labData.tests[0].price,
          }]);
        }
      } catch (error) {
        console.error("Error fetching lab details:", error);
        toast({
          title: "Error",
          description: "Failed to load lab details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (!lab || selectedTests.length === 0) {
      fetchLabData();
    } else {
      // Still check ownership even if lab is in state
      if (isLabOwner && params.id) {
        labOwnerAPI.getOwnedLabs()
          .then(res => {
            const labsList = res.data ?? res;
            setIsOwner(labsList.some((l: any) => l.id === params.id));
          })
          .catch(console.error);
      }
      setLoading(false);
    }
  }, [params.id, isLabOwner, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Lab not found</h2>
        <Button onClick={() => navigate("/labs")}>Back to Labs</Button>
      </div>
    );
  }

  const labAddress = typeof lab.address === 'string'
    ? lab.address
    : lab.address
      ? `${lab.address.street || ''}, ${lab.address.city || ''}, ${lab.address.state || ''} ${lab.address.zipCode || ''}`
      : `${lab.address_street || ''}, ${lab.address_city || ''}, ${lab.address_state || ''} ${lab.address_zip || ''}`;

  // Calculate total price for all selected tests
  const totalPrice = selectedTests.reduce((sum, t) => sum + (t.price || 0), 0);
  const discountedPrice = lab.discount
    ? Math.round(totalPrice - (totalPrice * lab.discount / 100))
    : totalPrice;

  const handleBookAppointment = () => {
    if (selectedTests.length === 0) return;
    navigate(`/test-booking/${selectedTests[0].id}`, {
      state: { lab, tests: selectedTests, price: discountedPrice }
    });
  };

  // Toggle test selection - add if not selected, remove if already selected
  const handleTestSelect = (newTest: any) => {
    const testData = {
      id: newTest.id,
      name: newTest.name,
      description: newTest.description,
      category: newTest.category?.name || newTest.category || "General",
      price: newTest.price,
    };
    
    const isAlreadySelected = selectedTests.some(t => t.id === newTest.id);
    
    if (isAlreadySelected) {
      // Remove from selection
      setSelectedTests(selectedTests.filter(t => t.id !== newTest.id));
      toast({
        title: "Test Removed",
        description: `${newTest.name} removed from cart`,
      });
    } else {
      // Add to selection
      setSelectedTests([...selectedTests, testData]);
      toast({
        title: "Test Added",
        description: `${newTest.name} added to cart`,
      });
    }
  };


  return (

    <div className="min-h-screen bg-slate-50/50 pt-16 relative selection:bg-primary/20">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] opacity-60" />
      </div>

      <main className="container mx-auto py-8 px-4 relative z-10">
        <Link to="/lab-tests" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Results
        </Link>

        {/* Lab Hero */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 group h-[350px]">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${lab.image || lab.imageUrl || "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?q=80&w=2070&auto=format&fit=crop"})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent/10" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground border-none">Verified Lab</Badge>
                  {lab.certifications && lab.certifications.length > 0 && (
                     <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-md">
                       <ShieldCheck className="h-3 w-3 mr-1" />
                       {lab.certifications[0]}
                     </Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{lab.name}</h1>
                <div className="flex items-center text-white/80 text-lg">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <p>{labAddress}</p>
                </div>
              </div>

              <div className="flex gap-4">
                 <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center min-w-[100px]">
                    <div className="flex justify-center items-center gap-1 text-yellow-400 font-bold text-2xl">
                      <Star className="h-6 w-6" fill="currentColor" />
                      {(lab.rating || 0).toFixed(1)}
                    </div>
                    <p className="text-xs text-white/60 font-medium">Rating</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center min-w-[100px]">
                    <div className="flex justify-center items-center gap-1 text-primary font-bold text-2xl">
                      <Clock className="h-6 w-6" />
                      Open
                    </div>
                    <p className="text-xs text-white/60 font-medium">Status</p>
                 </div>
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
              <TabsList className="w-full p-1 bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl mb-6 flex space-x-2">
                {["overview", "tests", "reviews"].map((tab) => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab}
                    className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all capitalize"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
                {!isLabOwner && (
                  <TabsTrigger 
                    value="testSearch" 
                     className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                  >
                    Search
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
                <div className="bg-white/80 dark:bg-card/80 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-sm space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                       <ShieldCheck className="h-6 w-6 text-primary" />
                       About {lab.name}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {lab.description || `${lab.name} provides high-quality diagnostic services with state-of-the-art infrastructure and a team of experts dedicated to clinical excellence.`}
                    </p>
                  </div>

                  <Separator className="bg-black/5" />

                  <div>
                    <h3 className="font-semibold text-lg mb-4">Certifications & Facilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(lab.certifications || ["Digital Reports", "Home Collection", "NABL Accredited"]).map((facility: string, i: number) => (
                        <div key={i} className="flex items-center p-4 bg-primary/5 rounded-xl border border-primary/10">
                          <CheckSquare className="h-5 w-5 text-primary mr-3" />
                          <span className="font-medium">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-black/5" />

                  <div>
                    <h3 className="font-semibold text-lg mb-4">Contact & Timings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center group">
                          <div className="bg-primary/10 p-3 rounded-xl mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <Phone className="h-5 w-5 text-primary group-hover:text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Phone</p>
                            <p className="text-base font-semibold">{lab.contactInfo?.phone || "+91 98765 43210"}</p>
                          </div>
                        </div>
                        <div className="flex items-center group">
                          <div className="bg-primary/10 p-3 rounded-xl mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <Mail className="h-5 w-5 text-primary group-hover:text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Email</p>
                            <p className="text-base font-semibold">{lab.contactInfo?.email || `contact@${lab.name.toLowerCase().replace(/\s+/g, '')}.in`}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center group">
                          <div className="bg-primary/10 p-3 rounded-xl mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <Clock className="h-5 w-5 text-primary group-hover:text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Operating Hours</p>
                            <p className="text-base font-semibold">
                              {lab.operatingHours ?
                                `Weekdays: ${lab.operatingHours.weekdays?.open} - ${lab.operatingHours.weekdays?.close}` :
                                "Mon-Sun: 7:00 AM - 9:00 PM"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center group">
                          <div className="bg-primary/10 p-3 rounded-xl mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <MapPin className="h-5 w-5 text-primary group-hover:text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Location</p>
                            <p className="text-base font-semibold">{labAddress}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tests" className="space-y-6 focus-visible:outline-none">
                <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm">
                  <div>
                    <h2 className="text-xl font-bold">Available Tests</h2>
                    <p className="text-sm text-muted-foreground mt-1">Select a test to book an appointment</p>
                  </div>
                  {isOwner && (
                    <Button onClick={() => navigate(`/lab-owner/${params.id}/add-test`)} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 rounded-xl">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Test
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(lab.tests || []).map((t: any) => {
                    const isSelected = selectedTests.some(st => st.id === t.id);
                    return (
                      <div
                        key={t.id}
                        className={`group border rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/60 backdrop-blur-sm ${isSelected ? 'border-primary ring-2 ring-primary/10 bg-primary/5' : 'border-white/20 hover:border-primary/30'}`}
                        onClick={() => handleTestSelect(t)}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors pr-2">{t.name}</h3>
                            <Badge variant="secondary" className="bg-white/50 backdrop-blur border text-xs font-semibold">
                              {t.category?.name || "General"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed">{t.description}</p>
                        </div>
                        <div className="flex justify-between items-end pt-4 border-t border-dashed border-gray-200">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Price</p>
                            <p className="font-black text-2xl text-primary flex items-baseline gap-1">
                               ₹{t.price}
                               <span className="text-xs font-normal text-muted-foreground line-through opacity-50">₹{Math.round(t.price * 1.2)}</span>
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant={isSelected ? "secondary" : "default"}
                            className={`rounded-xl px-6 h-10 font-bold shadow-md transition-all ${isSelected ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' : 'bg-primary hover:bg-primary/90 hover:shadow-primary/20 hover:scale-105'} `}
                          >
                            {isSelected ? (
                              <>
                                <CheckSquare className="h-4 w-4 mr-2" />
                                Added
                              </>
                            ) : "Add"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {(!lab.tests || lab.tests.length === 0) && (
                    <div className="col-span-2 py-16 text-center bg-white/50 rounded-2xl border border-dashed border-gray-300">
                       <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Plus className="h-8 w-8 text-gray-400" />
                       </div>
                      <p className="text-lg font-medium text-gray-600">No tests listed yet</p>
                      <p className="text-sm text-gray-400">Check back later for available tests</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {!isLabOwner && (
                <TabsContent value="testSearch" className="mt-6 focus-visible:outline-none">
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-sm">
                    <LabTestSearch 
                      tests={lab.tests || []}
                      onSelect={handleTestSelect}
                      selectedTests={selectedTests}
                    />
                  </div>
                </TabsContent>
              )}

              <TabsContent value="reviews" className="mt-6 focus-visible:outline-none">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-sm space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Patient Reviews</h2>
                      <p className="text-sm text-muted-foreground mt-1">Overall rating based on {lab.reviews?.length || 0} reviews</p>
                    </div>
                    <div className="flex flex-col items-end">
                       <div className="flex items-center bg-yellow-500/10 px-4 py-2 rounded-2xl border border-yellow-500/20">
                        <Star className="h-8 w-8 text-yellow-500 mr-2" fill="currentColor" />
                        <span className="text-4xl font-black text-yellow-600">{(lab.rating || 0).toFixed(1)}</span>
                       </div>
                       <div className="flex items-center gap-1 mt-2 text-yellow-500 text-sm">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} className={`h-3 w-3 ${i < Math.round(lab.rating || 0) ? 'fill-current' : 'opacity-30'}`} />
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {(lab.reviews || []).map((review: any, i: number) => (
                      <div key={review.id || i} className="group pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center font-bold text-lg text-white mr-4 shadow-md">
                              {(review.user?.name || "U")[0]}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{review.user?.name || "Verified User"}</p>
                              <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className="flex bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="pl-14 relative">
                           <span className="absolute left-14 top-0 text-4xl text-gray-200 font-serif -z-10">"</span>
                           <p className="text-gray-600 leading-relaxed italic">{review.text}</p>
                        </div>
                      </div>
                    ))}
                    {(!lab.reviews || lab.reviews.length === 0) && (
                      <div className="py-16 text-center bg-gray-50/50 rounded-2xl">
                        <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-sm flex items-center justify-center">
                           <Star className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="font-medium text-gray-900">No reviews yet</h3>
                        <p className="text-muted-foreground text-sm">Be the first to share your experience!</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Card */}
          <div className="space-y-6">
            {!isLabOwner && selectedTests.length > 0 && (
              <div className="bg-primary/95 text-primary-foreground rounded-2xl p-6 shadow-xl sticky top-24 transform transition-all hover:scale-[1.02]">
                <div className="flex justify-between items-center mb-4 border-b border-primary-foreground/20 pb-4">
                  <h3 className="text-xl font-bold">Booking Summary</h3>
                  <Badge variant="outline" className="bg-white/20 border-transparent text-white font-bold">
                    {selectedTests.length} test{selectedTests.length > 1 ? 's' : ''}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {/* List of selected tests */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedTests.map((t, idx) => (
                      <div key={t.id} className="bg-white/10 p-3 rounded-xl backdrop-blur-sm flex justify-between items-center">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm leading-tight truncate">{t.name}</p>
                          <p className="text-xs opacity-70">{t.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">₹{t.price}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleTestSelect(t); }}
                            className="h-5 w-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 px-1 pt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="opacity-80">Subtotal ({selectedTests.length} tests)</span>
                      <span className="font-medium">₹{totalPrice}</span>
                    </div>
                    {lab.discount > 0 && (
                      <div className="flex justify-between items-center text-sm font-bold text-green-300">
                        <span className="flex items-center">
                          <BadgePercent className="h-4 w-4 mr-2" />
                          Discount ({lab.discount}%)
                        </span>
                        <span>- ₹{Math.round(totalPrice * lab.discount / 100)}</span>
                      </div>
                    )}
                    <Separator className="bg-white/20 mt-4 mb-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Amount Payable</span>
                      <span className="text-3xl font-black">₹{discountedPrice}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg justify-center">
                      <Calendar className="h-4 w-4 opacity-70" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">Fast Report</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg justify-center">
                      <ShieldCheck className="h-4 w-4 opacity-70" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">ISO Certified</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleBookAppointment}
                    className="w-full bg-white text-primary hover:bg-white/90 font-bold h-12 text-lg rounded-xl shadow-lg"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            )}

            {isLabOwner && isOwner && (
              <div className="bg-card rounded-2xl border p-6 shadow-sm sticky top-24">
                <h3 className="font-bold text-xl mb-6">Ekitsa</h3>
                <div className="space-y-4">
                  <Button onClick={() => navigate(`/lab-owner/${params.id}/add-test`)} className="w-full bg-primary hover:bg-primary/90 h-12 font-bold rounded-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Test
                  </Button>
                  <Button variant="outline" onClick={() => navigate(`/lab-owner/dashboard`)} className="w-full h-12 font-bold rounded-xl border-2">
                    Manage Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LabDetail;
