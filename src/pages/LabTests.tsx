import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import TestResult, { Test } from "@/components/TestResult";
import LabCard, { Lab } from "@/components/LabCard";
import LabFilters, { LabFiltersState } from "@/components/LabFilters";
import CitySelection from "@/components/CitySelection";
import { ArrowLeft, Filter, BadgeIndianRupee, X, Sparkles, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RecommendedFilters from "@/components/RecommendedFilters";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Data fetching handled by API services

import { labsAPI } from "@/services/api";
import { Loader2 } from "lucide-react";

const LabTests = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("search") || "";
  
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Test[]>([]);
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [allLabs, setAllLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [filteredLabs, setFilteredLabs] = useState<Lab[]>([]);
  const [sortOption, setSortOption] = useState("relevance");
  const [filters, setFilters] = useState<LabFiltersState>({
    rating: 0,
    maxDistance: 10,
    openNow: false,
    facilities: {
      "Home Collection": false,
      "Digital Reports": false,
      "NABL Accredited": false,
      "Open 24x7": false,
      "Free Home Delivery": false,
      "Insurance Accepted": false,
    },
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch all tests
        const testsData = await labsAPI.getAllTests();
        const mappedTests: Test[] = testsData.map((t: any) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          category: t.category?.name || "General",
          price: t.price,
          isPopular: t.popularity > 80,
        }));
        setAllTests(mappedTests);

        // Fetch all labs
        const labsData = await labsAPI.getAllLabs({ city: selectedCity });
        const mappedLabs: Lab[] = labsData.map((l: any) => ({
          id: l.id,
          name: l.name,
          address: l.address ? `${l.address.street}, ${l.address.city}` : "Address not available",
          distance: Math.random() * 5, // Simulated distance for now as backend doesn't have lat/long
          rating: l.rating || 0,
          reviewCount: l.reviews?.length || 0,
          price: l.tests?.[0]?.price || 0, // Simplified price for listing
          waitTime: "15-20 min", // Simulated
          openNow: true, // Simulated
          facilities: l.certifications || [], // Mapping certifications to facilities for now
          imageUrl: l.image_url || "/placeholder.svg",
          accreditation: l.certifications?.[0],
        }));
        setAllLabs(mappedLabs);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load tests and labs. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [selectedCity, toast]);


  // Handle city change
  const handleCityChange = (city: string) => {
    setSelectedCity(city === "All Locations" ? "" : city);
    // Reset search and results when city changes
    setSearchQuery("");
    setSearchResults([]);
    setSelectedTest(null);
    setSelectedLab(null);

    toast({
      title: "City Updated",
      description: `Your location has been set to ${city}`,
    });
  };

  // Apply initial search from URL
  useEffect(() => {
    if (initialQuery && allTests.length > 0) {
      const filtered = allTests.filter(
        (test) =>
          test.name.toLowerCase().includes(initialQuery.toLowerCase()) ||
          test.description.toLowerCase().includes(initialQuery.toLowerCase()) ||
          test.category.toLowerCase().includes(initialQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [allTests, initialQuery]);

  // Handle search for blood tests
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedTest(null);
    setSelectedLab(null);

    // Filter tests based on query
    const filtered = allTests.filter(
      (test) =>
        test.name.toLowerCase().includes(query.toLowerCase()) ||
        test.description.toLowerCase().includes(query.toLowerCase()) ||
        test.category.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filtered);

    if (filtered.length === 0 && query !== "") {
      toast({
        title: "No tests found",
        description: "Try a different search term",
        variant: "destructive",
      });
    }
  };

  // Handle test selection
  const handleTestSelect = (test: Test) => {
    setSelectedTest(test);
    setSelectedLab(null);
  };

  // Handle lab selection
  const handleLabSelect = (lab: Lab) => {
    setSelectedLab(lab);
  };

  // Handle sort change
  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  // Handle filter change
  const handleFilterChange = (newFilters: LabFiltersState) => {
    setFilters(newFilters);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedCity("");
    setSearchQuery("");
    setSelectedTest(null);
    setSelectedLab(null);
    toast({
      title: "Filters Reset",
      description: "Showing all labs across all locations",
    });
  };

  // Apply filters and sorting to labs
  useEffect(() => {
    if (!selectedTest) return;

    // Filter labs
    let filtered = [...allLabs];

    if (filters.openNow) {
      filtered = filtered.filter((lab) => lab.openNow);
    }

    filtered = filtered.filter((lab) => lab.rating >= filters.rating);
    filtered = filtered.filter((lab) => lab.distance <= filters.maxDistance);

    // Filter by facilities
    const selectedFacilities = Object.entries(filters.facilities)
      .filter(([_, isSelected]) => isSelected)
      .map(([facility]) => facility);

    if (selectedFacilities.length > 0) {
      filtered = filtered.filter((lab) =>
        selectedFacilities.every((facility) =>
          lab.facilities.includes(facility)
        )
      );
    }

    // Sort labs
    switch (sortOption) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "distance":
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "wait-time":
        filtered.sort((a, b) => {
          const aTime = parseInt(a.waitTime.split("-")[0]);
          const bTime = parseInt(b.waitTime.split("-")[0]);
          return aTime - bTime;
        });
        break;
      default:
        // relevance - keep default order
        break;
    }

    setFilteredLabs(filtered);
  }, [selectedTest, filters, sortOption, allLabs]);

  // Function to view lab details
  const handleViewLabDetails = (lab: Lab) => {
    navigate(`/lab/${lab.id}`, { state: { lab } });
  };

  // Handle filter selection from recommended filters
  const handleFilterSelect = (filter: string) => {
    setSearchQuery(filter);
    handleSearch(filter);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col pt-16 relative selection:bg-primary/20">
      
      {/* Background Gradients & Patterns */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] opacity-60" />
      </div>

      {/* Hero Section */}
      <div className="relative bg-black text-white pb-24 pt-16 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-purple-900/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          {!selectedTest && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6 max-w-4xl mx-auto"
            >
              <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10 backdrop-blur-md mb-2 px-4 py-1.5 text-sm rounded-full">
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                Trusted by 500+ Labs
              </Badge>
              <h1 className="text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                Find the Right Lab for Your{" "}
                <span className="text-primary italic">Diagnostics</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Compare prices, check reviews, and book appointments with NABL-accredited labs near you.
              </p>
            </motion.div>
          )}

          {/* Search Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`mt-10 ${selectedTest ? 'max-w-7xl' : 'max-w-3xl'} mx-auto transition-all duration-500`}
          >
            <div className={`
              backdrop-blur-2xl border p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 items-center transition-all duration-300
              ${selectedTest 
                ? 'bg-white/90 border-white/20 shadow-primary/5' 
                : 'bg-white/10 border-white/20'
              }
            `}>
              <div className={`w-full md:w-auto min-w-[220px] border-b md:border-b-0 md:border-r md:pr-2 transition-colors ${selectedTest ? 'border-gray-200' : 'border-white/10'}`}>
                <CitySelection
                  selectedCity={selectedCity || "All Locations"}
                  onCityChange={handleCityChange}
                  className={selectedTest ? "text-foreground" : "text-white placeholder:text-white/70"}
                />
              </div>
              <div className="flex-1 w-full relative z-20">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder={`Search for blood tests (e.g. CBC, Lipid Profile)`}
                  context="lab"
                  animated={false}
                  className={selectedTest ? "text-foreground" : ""}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="flex-grow container mx-auto -mt-16 relative z-20 px-4 pb-20">
        
        {/* Recommended Filters */}
        <AnimatePresence>
          {!selectedTest && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="bg-card/50 backdrop-blur-md border rounded-2xl p-6 shadow-lg">
                <RecommendedFilters onFilterSelect={handleFilterSelect} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Test Results */}
        <AnimatePresence mode="wait">
          {searchResults.length > 0 && !selectedTest && (
            <motion.div 
              key="results"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={containerVariants}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Test Results <span className="text-muted-foreground text-sm font-normal">({searchResults.length} found)</span>
                </h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((test) => (
                  <motion.div key={test.id} variants={itemVariants}>
                    <TestResult
                      test={test}
                      isSelected={selectedTest?.id === test.id}
                      onSelect={handleTestSelect}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Lab Selection */}
          {selectedTest && (
            <motion.div 
              key="labs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mb-2 pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary"
                      onClick={() => {
                        setSelectedTest(null);
                        setSearchResults(
                          allTests.filter((test) =>
                            test.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          )
                        );
                      }}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to results
                    </Button>
                    <h2 className="text-3xl font-bold mb-2">
                      Labs offering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">{selectedTest.name}</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">Compare prices, ratings, and facilities to choose the best lab for you</p>
                  </div>
                  
                  {/* Mobile Filter Button */}
                  <div className="md:hidden">
                    <Sheet
                      open={isMobileFilterOpen}
                      onOpenChange={setIsMobileFilterOpen}
                    >
                      <SheetTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Filter className="h-4 w-4 mr-2" />
                          Filters & Sort
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-full sm:max-w-md p-0">
                        <div className="overflow-y-auto h-full">
                          <LabFilters
                            onSortChange={handleSortChange}
                            onFilterChange={handleFilterChange}
                            initialFilters={filters}
                            initialSortOption={sortOption}
                            isMobile={true}
                            onClose={() => setIsMobileFilterOpen(false)}
                            onReset={handleResetFilters}
                            isExternalFilterActive={!!selectedCity}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>

                <RecommendedFilters
                  onFilterSelect={handleFilterSelect}
                  recommendedFilters={[
                    "NABL Accredited",
                    "Home Collection",
                    "Digital Reports",
                    "Open 24x7",
                    "Insurance Accepted",
                  ]}
                  title="Quick Filters:"
                  className="mb-0"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Filters - Desktop */}
                <div className="hidden md:block md:w-1/4 lg:w-1/5 space-y-6">
                  <div className="sticky top-24">
                     <LabFilters
                      onSortChange={handleSortChange}
                      onFilterChange={handleFilterChange}
                      initialFilters={filters}
                      initialSortOption={sortOption}
                      onReset={handleResetFilters}
                      isExternalFilterActive={!!selectedCity}
                    />
                  </div>
                </div>

                {/* Labs Grid */}
                <div className="flex-1">
                  {filteredLabs.length > 0 ? (
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
                    >
                      {filteredLabs.map((lab) => (
                        <motion.div key={lab.id} variants={itemVariants}>
                          <LabCard
                            lab={lab}
                            onSelect={handleLabSelect}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-20 bg-card border border-dashed rounded-3xl"
                    >
                      <div className="bg-muted/50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No labs found</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                        We couldn't find any labs matching your current filters. Try adjusting them or searching for a different area.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const resetFilters = {
                            rating: 0,
                            maxDistance: 10,
                            openNow: false,
                            facilities: {
                              "Home Collection": false,
                              "Digital Reports": false,
                              "NABL Accredited": false,
                              "Open 24x7": false,
                              "Free Home Delivery": false,
                              "Insurance Accepted": false,
                            },
                          };
                          setFilters(resetFilters);
                          setSortOption("relevance");
                          handleResetFilters();
                        }}
                      >
                        Reset All Filters
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lab Selection Modal */}
        <AnimatePresence>
          {selectedLab && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedLab(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border ring-1 ring-white/10"
              >
                <div className="relative">
                  <div
                    className="h-48 bg-cover bg-center w-full"
                    style={{
                      backgroundImage: `url(${selectedLab.imageUrl || "/placeholder.svg"})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/20 backdrop-blur-md text-white hover:bg-black/40 rounded-full"
                    onClick={() => setSelectedLab(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-0.5">{selectedLab.name}</h3>
                    <p className="text-white/80 text-sm truncate">{selectedLab.address}</p>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                      <span className="text-muted-foreground text-sm font-medium">Selected Test</span>
                      <span className="font-bold text-primary">{selectedTest?.name}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Price</span>
                      <div className="text-right">
                        {selectedLab.discount ? (
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-2xl">
                              ₹{Math.round(selectedLab.price - (selectedLab.price * selectedLab.discount) / 100)}
                            </span>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="line-through text-muted-foreground">₹{selectedLab.price}</span>
                              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-0 h-5 px-1.5">{selectedLab.discount}% OFF</Badge>
                            </div>
                          </div>
                        ) : (
                          <span className="font-bold text-2xl">₹{selectedLab.price}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded-xl bg-card">
                        <span className="text-xs text-muted-foreground block mb-1">Wait Time</span>
                        <span className="font-semibold">{selectedLab.waitTime}</span>
                      </div>
                      <div className="p-3 border rounded-xl bg-card">
                        <span className="text-xs text-muted-foreground block mb-1">Status</span>
                        <span className="font-semibold text-green-600 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          Open Now
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-12 rounded-xl border-2"
                      onClick={() => setSelectedLab(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20"
                      onClick={() => handleViewLabDetails(selectedLab)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-[60]">
            <div className="bg-card p-6 rounded-2xl shadow-xl border flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="font-medium">Finding best labs...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LabTests;
