
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LabFilters, { LabFiltersState } from "@/components/LabFilters";
import LabTestSearch from "@/components/LabTestSearch";
import TestResult from "@/components/TestResult";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CitySelection from "@/components/CitySelection";

const LabTests = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [activeTab, setActiveTab] = useState("all");
  
  // Add states for sorting and filtering
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
  
  // Add state for test selection
  const [selectedTest, setSelectedTest] = useState<null | { id: string, name: string, description: string, category: string }>(null);

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const cityParam = queryParams.get("city");
  const queryParam = queryParams.get("query");
  const dateParam = queryParams.get("date");

  // Set up initial state based on URL parameters
  const [searchQuery, setSearchQuery] = useState(queryParam || "");
  
  useEffect(() => {
    if (cityParam) {
      setSelectedCity(cityParam);
    }
    
    // Set active tab based on query parameters
    const testType = queryParams.get("type");
    if (testType) {
      setActiveTab(testType);
    }
  }, [cityParam, queryParams]);

  // Sample test data for the TestResult component
  const sampleTest = {
    id: "sample-test-1",
    name: "Complete Blood Count",
    description: "Basic blood test to check overall health",
    category: "Blood Test",
    price: 599,
    discount: 25,
    isPopular: true
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Update URL with search parameters
    const params = new URLSearchParams(location.search);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    
    // Update URL with city parameter
    const params = new URLSearchParams(location.search);
    params.set("city", city);
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL with test type parameter
    const params = new URLSearchParams(location.search);
    if (value !== "all") {
      params.set("type", value);
    } else {
      params.delete("type");
    }
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };
  
  // Handlers for LabFilters props
  const handleSortChange = (option: string) => {
    setSortOption(option);
    // Additional logic for sorting test results could be added here
  };
  
  const handleFilterChange = (newFilters: LabFiltersState) => {
    setFilters(newFilters);
    // Additional logic for filtering test results could be added here
  };
  
  // Handler for TestResult selection
  const handleTestSelect = (test: any) => {
    setSelectedTest(test.id === selectedTest?.id ? null : test);
  };

  // Mock data for popular tests
  const popularTests = [
    { id: 1, name: "Complete Blood Count", price: 599, discountPrice: 399 },
    { id: 2, name: "Lipid Profile", price: 799, discountPrice: 499 },
    { id: 3, name: "Thyroid Profile", price: 1199, discountPrice: 799 },
    { id: 4, name: "Vitamin D Test", price: 899, discountPrice: 649 },
    { id: 5, name: "Diabetes Screening", price: 999, discountPrice: 699 },
    { id: 6, name: "HbA1c Test", price: 599, discountPrice: 449 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto py-6 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Lab Tests</h1>
          <p className="text-muted-foreground">
            Compare prices and book diagnostic tests from the best labs in {selectedCity}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <CitySelection
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
            className="w-full md:w-auto"
          />
          <div className="flex-grow">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for tests, packages, or labs..."
              context="lab"
              animated={false}
            />
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="popular">Popular Tests</TabsTrigger>
            <TabsTrigger value="packages">Health Packages</TabsTrigger>
            <TabsTrigger value="covid">Covid Tests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Mobile Filter Button */}
              <div className="md:hidden mb-4">
                <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <div className="py-4">
                      <h2 className="text-lg font-semibold mb-4">Filter Tests</h2>
                      <LabFilters 
                        onSortChange={handleSortChange}
                        onFilterChange={handleFilterChange}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop Filters */}
              <div className="hidden md:block w-64 shrink-0">
                <div className="sticky top-24">
                  <h2 className="text-lg font-semibold mb-4">Filter Tests</h2>
                  <LabFilters 
                    onSortChange={handleSortChange}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>

              {/* Test Results */}
              <div className="flex-1">
                <LabTestSearch />
                <TestResult 
                  test={sampleTest}
                  isSelected={selectedTest?.id === sampleTest.id}
                  onSelect={handleTestSelect}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="popular" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTests.map(test => (
                <div key={test.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">{test.name}</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm line-through text-muted-foreground">₹{test.price}</span>
                      <span className="text-primary font-semibold ml-2">₹{test.discountPrice}</span>
                    </div>
                    <Button size="sm" variant="outline">Book Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="packages" className="mt-4">
            <div className="p-8 text-center border rounded-lg bg-muted/50">
              <h3 className="text-xl font-medium mb-2">Health Packages</h3>
              <p className="text-muted-foreground mb-4">
                Comprehensive health packages for preventive care and early detection
              </p>
              <Button>View All Packages</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="covid" className="mt-4">
            <div className="p-8 text-center border rounded-lg bg-muted/50">
              <h3 className="text-xl font-medium mb-2">COVID-19 Tests</h3>
              <p className="text-muted-foreground mb-4">
                RT-PCR, Rapid Antigen, and Antibody tests with home collection available
              </p>
              <Button>View COVID Tests</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default LabTests;
