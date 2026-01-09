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
  const params = useParams<{ labId: string }>();
  const [lab, setLab] = useState<any>(location.state?.lab || null);
  const [test, setTest] = useState<any>(location.state?.test || null);
  const [loading, setLoading] = useState(!lab);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isOwner, setIsOwner] = useState(false);
  const isLabOwner = authAPI.getCurrentUserRole() === "lab_owner";

  useEffect(() => {
    const fetchLabData = async () => {
      if (!params.labId) return;

      try {
        setLoading(true);
        const labData = await labsAPI.getLabById(params.labId);
        setLab(labData);

        // Check ownership if user is a lab owner
        if (isLabOwner) {
          const ownedLabs = await labOwnerAPI.getOwnedLabs();
          const labsList = ownedLabs.data ?? ownedLabs;
          setIsOwner(labsList.some((l: any) => l.id === params.labId));
        }

        // If no test was passed in state, pick the first one from the lab
        if (!test && labData.tests && labData.tests.length > 0) {
          setTest({
            id: labData.tests[0].id,
            name: labData.tests[0].name,
            description: labData.tests[0].description,
            category: labData.tests[0].category?.name || "General",
            price: labData.tests[0].price,
          });
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

    if (!lab || !test) {
      fetchLabData();
    } else {
      // Still check ownership even if lab is in state
      if (isLabOwner && params.labId) {
        labOwnerAPI.getOwnedLabs()
          .then(res => {
            const labsList = res.data ?? res;
            setIsOwner(labsList.some((l: any) => l.id === params.labId));
          })
          .catch(console.error);
      }
      setLoading(false);
    }
  }, [params.labId, isLabOwner, toast]);

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
    : `${lab.address?.street || ''}, ${lab.address?.city || ''}, ${lab.address?.state || ''} ${lab.address?.zipCode || ''}`;

  const discountedPrice = lab.discount
    ? Math.round((test?.price || 0) - ((test?.price || 0) * lab.discount / 100))
    : (test?.price || 0);

  const handleBookAppointment = () => {
    if (!test) return;
    navigate(`/test-booking/${test.id}`, {
      state: { lab, test, price: discountedPrice }
    });
  };

  const handleTestSelect = (newTest: any) => {
    setTest({
      id: newTest.id,
      name: newTest.name,
      description: newTest.description,
      category: newTest.category?.name || newTest.category || "General",
      price: newTest.price,
    });
    toast({
      title: "Test Selected",
      description: `${newTest.name} selected`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6 px-4">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Lab Header */}
        <div
          className="h-64 rounded-xl bg-cover bg-center w-full mb-6 relative overflow-hidden"
          style={{ backgroundImage: `url(${lab.image || lab.imageUrl || "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?q=80&w=2070&auto=format&fit=crop"})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl">
            <div className="absolute bottom-0 p-6 text-white">
              <h1 className="text-3xl font-bold">{lab.name}</h1>
              <div className="flex items-center mt-2 opacity-90">
                <MapPin className="h-4 w-4 mr-2" />
                <p>{labAddress}</p>
              </div>
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                  <span className="font-medium">{(lab.rating || 0).toFixed(1)}</span>
                  <span className="text-white/80 ml-1 text-sm">({lab.reviews?.length || 0})</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Open Now</span>
                </div>
                {lab.certifications && lab.certifications.length > 0 && (
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{lab.certifications[0]}</span>
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
                <TabsTrigger value="tests">Tests</TabsTrigger>
                {!isLabOwner && (
                  <TabsTrigger value="testSearch">Search</TabsTrigger>
                )}
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6 focus-visible:outline-none">
                <div className="bg-card rounded-xl border p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-3">About {lab.name}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {lab.description || `${lab.name} provides high-quality diagnostic services with state-of-the-art infrastructure and a team of experts dedicated to clinical excellence.`}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-4">Certifications & Facilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(lab.certifications || ["Digital Reports", "Home Collection", "NABL Accredited"]).map((facility: string, i: number) => (
                        <div key={i} className="flex items-center p-3 bg-secondary/30 rounded-lg">
                          <CheckSquare className="h-5 w-5 text-primary mr-3" />
                          <span className="text-sm font-medium">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-4">Contact & Timings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-lg mr-3">
                            <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Phone</p>
                            <p className="text-sm font-medium">{lab.contactInfo?.phone || "+91 98765 43210"}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-lg mr-3">
                            <Mail className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Email</p>
                            <p className="text-sm font-medium">{lab.contactInfo?.email || `contact@${lab.name.toLowerCase().replace(/\s+/g, '')}.in`}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-lg mr-3">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Operating Hours</p>
                            <p className="text-sm font-medium">
                              {lab.operatingHours ?
                                `Weekdays: ${lab.operatingHours.weekdays?.open} - ${lab.operatingHours.weekdays?.close}` :
                                "Mon-Sun: 7:00 AM - 9:00 PM"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-lg mr-3">
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Location</p>
                            <p className="text-sm font-medium">{labAddress}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tests" className="space-y-6 mt-6 focus-visible:outline-none">
                <div className="flex justify-between items-center bg-card p-6 rounded-xl border shadow-sm">
                  <div>
                    <h2 className="text-xl font-bold">Available Tests</h2>
                    <p className="text-sm text-muted-foreground">Select a test to book an appointment</p>
                  </div>
                  {isOwner && (
                    <Button onClick={() => navigate(`/lab-owner/${params.labId}/add-test`)} className="bg-primary hover:bg-primary/90 shadow-md transition-all hover:scale-105">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Test
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(lab.tests || []).map((t: any) => (
                    <div
                      key={t.id}
                      className={`group border rounded-xl p-5 flex flex-col justify-between cursor-pointer transition-all hover:shadow-md hover:border-primary/50 bg-card ${test?.id === t.id ? 'border-primary ring-1 ring-primary/20' : ''}`}
                      onClick={() => handleTestSelect(t)}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{t.name}</h3>
                          <Badge variant="outline" className="bg-secondary/50 text-secondary-foreground border-transparent">
                            {t.category?.name || "General"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{t.description}</p>
                      </div>
                      <div className="flex justify-between items-end border-t pt-4">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Price</p>
                          <p className="font-extrabold text-xl text-primary">₹{t.price}</p>
                        </div>
                        <Button
                          size="sm"
                          variant={test?.id === t.id ? "secondary" : "default"}
                          className={`rounded-full px-5 ${test?.id === t.id ? 'bg-primary text-primary-foreground' : ''}`}
                        >
                          {test?.id === t.id ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!lab.tests || lab.tests.length === 0) && (
                    <div className="col-span-2 py-12 text-center bg-card rounded-xl border border-dashed">
                      <p className="text-muted-foreground">No tests listed for this lab yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {!isLabOwner && (
                <TabsContent value="testSearch" className="mt-6 focus-visible:outline-none">
                  <div className="bg-card rounded-xl border p-6 shadow-sm">
                    <LabTestSearch />
                  </div>
                </TabsContent>
              )}

              <TabsContent value="reviews" className="mt-6 focus-visible:outline-none">
                <div className="bg-card rounded-xl border p-6 shadow-sm space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Patient Reviews</h2>
                      <p className="text-sm text-muted-foreground">Overall rating based on {lab.reviews?.length || 0} reviews</p>
                    </div>
                    <div className="flex items-center bg-primary/10 px-4 py-2 rounded-xl">
                      <Star className="h-6 w-6 text-yellow-500 mr-2" fill="currentColor" />
                      <span className="text-3xl font-extrabold text-primary">{(lab.rating || 0).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {(lab.reviews || []).map((review: any, i: number) => (
                      <div key={review.id || i} className="group pb-6 border-b last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-lg text-primary mr-3">
                              {(review.user?.name || "U")[0]}
                            </div>
                            <div>
                              <p className="font-bold">{review.user?.name || "Verified User"}</p>
                              <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className="flex bg-yellow-50 px-2 py-1 rounded">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                fill="currentColor"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed pl-13 italic">"{review.text}"</p>
                      </div>
                    ))}
                    {(!lab.reviews || lab.reviews.length === 0) && (
                      <div className="py-12 text-center">
                        <p className="text-muted-foreground italic">No reviews yet. Be the first to share your experience!</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Card */}
          <div className="space-y-6">
            {!isLabOwner && test && (
              <div className="bg-primary/95 text-primary-foreground rounded-2xl p-6 shadow-xl sticky top-24 transform transition-all hover:scale-[1.02]">
                <h3 className="text-xl font-bold mb-6 border-b border-primary-foreground/20 pb-4">Booking Summary</h3>

                <div className="space-y-6">
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs uppercase tracking-widest font-bold opacity-70">Test Name</span>
                      <Badge variant="outline" className="text-[10px] h-5 bg-white/20 border-transparent text-white font-bold">
                        {test.category}
                      </Badge>
                    </div>
                    <p className="font-bold text-lg leading-tight">{test.name}</p>
                  </div>

                  <div className="space-y-3 px-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="opacity-80">Standard Price</span>
                      <span className="font-medium">₹{test.price}</span>
                    </div>
                    {lab.discount > 0 && (
                      <div className="flex justify-between items-center text-sm font-bold text-green-300">
                        <span className="flex items-center">
                          <BadgePercent className="h-4 w-4 mr-2" />
                          Exclusive Discount
                        </span>
                        <span>- ₹{Math.round(test.price * lab.discount / 100)}</span>
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
                <h3 className="font-bold text-xl mb-6">Lab Management</h3>
                <div className="space-y-4">
                  <Button onClick={() => navigate(`/lab-owner/${params.labId}/add-test`)} className="w-full bg-primary hover:bg-primary/90 h-12 font-bold rounded-xl">
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
