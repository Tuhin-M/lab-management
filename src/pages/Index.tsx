import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import SearchBar from "@/components/SearchBar";
import TestResult, { Test } from "@/components/TestResult";
import LabCard, { Lab } from "@/components/LabCard";
import LabFilters, { LabFiltersState } from "@/components/LabFilters";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Sample data for tests
const mockTests: Test[] = [
  {
    id: "1",
    name: "Complete Blood Count (CBC)",
    description: "Measures red and white blood cells, platelets, and hemoglobin",
    category: "Hematology",
  },
  {
    id: "2",
    name: "Comprehensive Metabolic Panel",
    description: "Provides information about your body's fluid balance, levels of electrolytes, and metabolism",
    category: "Chemistry",
  },
  {
    id: "3",
    name: "Lipid Panel",
    description: "Measures cholesterol levels and fats in your blood",
    category: "Chemistry",
  },
  {
    id: "4",
    name: "Thyroid Function Tests",
    description: "Assesses how well your thyroid gland is working",
    category: "Endocrinology",
  },
  {
    id: "5",
    name: "Hemoglobin A1C",
    description: "Monitors blood sugar levels over time for diabetes management",
    category: "Endocrinology",
  },
  {
    id: "6",
    name: "Vitamin D Test",
    description: "Measures the level of vitamin D in your blood",
    category: "Nutrition",
  },
];

// Sample data for labs
const mockLabs: Lab[] = [
  {
    id: "1",
    name: "LifeCare Diagnostics",
    address: "123 Medical Plaza, Suite 101, New York, NY",
    distance: 1.2,
    rating: 4.7,
    reviewCount: 142,
    price: 45,
    waitTime: "10-15 min",
    openNow: true,
    facilities: ["Home Collection", "Digital Reports", "Insurance Accepted"],
    imageUrl: "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "MedExpress Labs",
    address: "456 Health Avenue, Brooklyn, NY",
    distance: 3.5,
    rating: 4.2,
    reviewCount: 98,
    price: 35,
    waitTime: "5-10 min",
    openNow: true,
    facilities: ["Digital Reports", "24/7 Service"],
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Premier Diagnostics Center",
    address: "789 Wellness Road, Queens, NY",
    distance: 5.8,
    rating: 4.9,
    reviewCount: 215,
    price: 65,
    waitTime: "20-30 min",
    openNow: false,
    facilities: ["Home Collection", "Digital Reports", "Insurance Accepted", "Premium Facilities"],
    imageUrl: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "City Health Labs",
    address: "101 Medical Drive, Bronx, NY",
    distance: 2.3,
    rating: 3.8,
    reviewCount: 67,
    price: 30,
    waitTime: "15-20 min",
    openNow: true,
    facilities: ["Insurance Accepted", "Digital Reports"],
    imageUrl: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "Advanced Pathology Associates",
    address: "202 Healthcare Blvd, Staten Island, NY",
    distance: 7.1,
    rating: 4.5,
    reviewCount: 183,
    price: 55,
    waitTime: "10-15 min",
    openNow: true,
    facilities: ["Home Collection", "24/7 Service", "Premium Facilities"],
    imageUrl: "https://images.unsplash.com/photo-1666214276372-24e621c10046?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "Precision Diagnostics",
    address: "303 Science Park, Manhattan, NY",
    distance: 0.8,
    rating: 4.4,
    reviewCount: 112,
    price: 50,
    waitTime: "5-10 min",
    openNow: false,
    facilities: ["Digital Reports", "Insurance Accepted", "Premium Facilities"],
    imageUrl: "https://images.unsplash.com/photo-1581093196277-9f6070b4a8bb?q=80&w=2070&auto=format&fit=crop",
  },
];

const Index = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Test[]>([]);
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
      "Insurance Accepted": false,
      "24/7 Service": false,
    },
  });

  // Handle search for blood tests
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedTest(null);
    setSelectedLab(null);

    // Filter tests based on query
    const filtered = mockTests.filter(
      (test) =>
        test.name.toLowerCase().includes(query.toLowerCase()) ||
        test.description.toLowerCase().includes(query.toLowerCase()) ||
        test.category.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filtered);

    if (filtered.length === 0) {
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
    toast({
      title: "Test Selected",
      description: `You selected ${test.name}`,
    });
  };

  // Handle lab selection
  const handleLabSelect = (lab: Lab) => {
    setSelectedLab(lab);
    toast({
      title: "Lab Selected",
      description: `You selected ${lab.name} for your test`,
    });
  };

  // Handle sort change
  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  // Handle filter change
  const handleFilterChange = (newFilters: LabFiltersState) => {
    setFilters(newFilters);
  };

  // Apply filters and sorting to labs
  useEffect(() => {
    if (!selectedTest) return;

    // Filter labs
    let filtered = [...mockLabs];

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
        selectedFacilities.every((facility) => lab.facilities.includes(facility))
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
  }, [selectedTest, filters, sortOption]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Ekitsa</h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button>Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4">
        {/* Hero Section */}
        {!searchQuery && (
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Find the Right Lab for Your{" "}
              <span className="text-primary">Blood Tests</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Search for blood tests, compare lab pricing and availability, and book appointments
              all in one place.
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Test Results */}
        {searchResults.length > 0 && !selectedTest && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Results ({searchResults.length})</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((test) => (
                <TestResult
                  key={test.id}
                  test={test}
                  isSelected={selectedTest?.id === test.id}
                  onSelect={handleTestSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Lab Selection */}
        {selectedTest && (
          <div className="space-y-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="mr-2"
                onClick={() => {
                  setSelectedTest(null);
                  setSearchResults(
                    mockTests.filter((test) =>
                      test.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  );
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h2 className="text-xl font-semibold">
                Labs offering{" "}
                <span className="text-primary">{selectedTest.name}</span>
              </h2>
            </div>

            {/* Filters */}
            <LabFilters
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
            />

            {/* Labs Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredLabs.length > 0 ? (
                filteredLabs.map((lab) => (
                  <LabCard
                    key={lab.id}
                    lab={lab}
                    onSelect={handleLabSelect}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <h3 className="text-lg font-medium">No labs match your criteria</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search for a different test.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lab Selection Confirmation */}
        {selectedLab && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card max-w-md w-full rounded-lg shadow-lg overflow-hidden border">
              <div 
                className="h-32 bg-cover bg-center w-full" 
                style={{ backgroundImage: `url(${selectedLab.imageUrl || '/placeholder.svg'})` }}
              />
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">{selectedLab.name}</h3>
                <p className="text-muted-foreground">{selectedLab.address}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Test:</span>
                    <span className="font-medium">{selectedTest?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">${selectedLab.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated wait:</span>
                    <span className="font-medium">{selectedLab.waitTime}</span>
                  </div>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedLab(null)}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1">Book Appointment</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto py-6 px-4 md:flex justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
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

export default Index;
