import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import TestResult, { Test } from "@/components/TestResult";
import LabCard, { Lab } from "@/components/LabCard";
import LabFilters, { LabFiltersState } from "@/components/LabFilters";
import CitySelection from "@/components/CitySelection";
import { ArrowLeft, Filter, BadgeIndianRupee, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RecommendedFilters from "@/components/RecommendedFilters";
import { Button } from "@/components/ui/button";

// Sample data for tests with Indian context
const mockTests: Test[] = [
  {
    id: "1",
    name: "Complete Blood Count (CBC)",
    description:
      "Measures red and white blood cells, platelets, and hemoglobin levels",
    category: "Hematology",
    price: 499,
    discount: 10,
    isPopular: true,
  },
  {
    id: "2",
    name: "Thyroid Profile",
    description: "Checks thyroid function with T3, T4, and TSH tests",
    category: "Endocrinology",
    price: 899,
    discount: 15,
    isPopular: true,
  },
  {
    id: "3",
    name: "Lipid Profile",
    description: "Measures cholesterol and triglyceride levels in your blood",
    category: "Chemistry",
    price: 699,
    discount: 5,
  },
  {
    id: "4",
    name: "Vitamin D Test",
    description: "Measures the level of vitamin D in your blood",
    category: "Nutrition",
    price: 1299,
    discount: 20,
  },
  {
    id: "5",
    name: "HbA1c",
    description:
      "Monitors blood sugar levels over time for diabetes management",
    category: "Endocrinology",
    price: 599,
  },
  {
    id: "6",
    name: "Liver Function Test",
    description: "Assesses how well your liver is functioning",
    category: "Chemistry",
    price: 799,
    discount: 10,
  },
];

// Sample data for labs with Indian context
const mockLabs: Lab[] = [
  {
    id: "1",
    name: "Apollo Diagnostics",
    address: "Koramangala, Bengaluru, Karnataka 560034",
    distance: 1.2,
    rating: 4.7,
    reviewCount: 142,
    price: 449,
    discount: 10,
    waitTime: "10-15 min",
    openNow: true,
    facilities: [
      "Home Collection",
      "Digital Reports",
      "NABL Accredited",
      "Insurance Accepted",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?q=80&w=2070&auto=format&fit=crop",
    accreditation: "NABL Accredited Lab",
    yearEstablished: 2005,
  },
  {
    id: "2",
    name: "Thyrocare Technologies",
    address: "Indiranagar, Bengaluru, Karnataka 560038",
    distance: 3.5,
    rating: 4.2,
    reviewCount: 98,
    price: 399,
    discount: 15,
    waitTime: "5-10 min",
    openNow: true,
    facilities: ["Digital Reports", "Open 24x7", "Home Collection"],
    imageUrl:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Metropolis Healthcare",
    address: "HSR Layout, Bengaluru, Karnataka 560102",
    distance: 5.8,
    rating: 4.8,
    reviewCount: 215,
    price: 499,
    discount: 5,
    waitTime: "20-30 min",
    openNow: false,
    facilities: [
      "Home Collection",
      "Digital Reports",
      "NABL Accredited",
      "Free Home Delivery",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=1974&auto=format&fit=crop",
    accreditation: "NABL and CAP Accredited",
  },
  {
    id: "4",
    name: "Dr. Lal PathLabs",
    address: "Jayanagar, Bengaluru, Karnataka 560069",
    distance: 2.3,
    rating: 3.9,
    reviewCount: 67,
    price: 375,
    waitTime: "15-20 min",
    openNow: true,
    facilities: ["Insurance Accepted", "Digital Reports"],
    imageUrl:
      "https://images.unsplash.com/photo-1504439468489-c8920d796a29?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "SRL Diagnostics",
    address: "Whitefield, Bengaluru, Karnataka 560066",
    distance: 7.1,
    rating: 4.5,
    reviewCount: 183,
    price: 459,
    discount: 12,
    waitTime: "10-15 min",
    openNow: true,
    facilities: ["Home Collection", "Open 24x7", "NABL Accredited"],
    imageUrl:
      "https://images.unsplash.com/photo-1666214276372-24e621c10046?q=80&w=2070&auto=format&fit=crop",
    accreditation: "NABL Accredited Lab",
  },
  {
    id: "6",
    name: "Neuberg Diagnostics",
    address: "BTM Layout, Bengaluru, Karnataka 560076",
    distance: 0.8,
    rating: 4.4,
    reviewCount: 112,
    price: 425,
    discount: 10,
    waitTime: "5-10 min",
    openNow: false,
    facilities: ["Digital Reports", "Insurance Accepted", "Free Home Delivery"],
    imageUrl:
      "https://images.unsplash.com/photo-1581093196277-9f6070b4a8bb?q=80&w=2070&auto=format&fit=crop",
  },
];

const LabTests = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
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
      "NABL Accredited": false,
      "Open 24x7": false,
      "Free Home Delivery": false,
      "Insurance Accepted": false,
    },
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Handle city change
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
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
  }, [selectedTest, filters, sortOption]);

  // Function to view lab details
  const handleViewLabDetails = (lab: Lab) => {
    navigate(`/lab/${lab.id}`, { state: { lab } });
  };

  // Handle filter selection from recommended filters
  const handleFilterSelect = (filter: string) => {
    setSearchQuery(filter);
    handleSearch(filter);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}

      <main className="flex-grow container mx-auto py-8 px-4">
        {/* Hero Section */}
        {!searchQuery && (
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Find the Right Lab for Your{" "}
              <span className="text-primary">Blood Tests</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Search for blood tests, compare lab pricing and availability, and
              book appointments all in one place.
            </p>
          </div>
        )}

        {/* City Selection and Search Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-3xl mx-auto">
            <CitySelection
              selectedCity={selectedCity}
              onCityChange={handleCityChange}
              className="w-full md:w-auto"
            />
            <div className="flex-1 w-full">
              <SearchBar
                onSearch={handleSearch}
                placeholder={`Search for blood tests in ${selectedCity}`}
              />
            </div>
          </div>
        </div>

        {/* Recommended Filters */}
        {!selectedTest && (
          <RecommendedFilters onFilterSelect={handleFilterSelect} />
        )}

        {/* Test Results */}
        {searchResults.length > 0 && !selectedTest && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Test Results ({searchResults.length})
            </h2>
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
                      test.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
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

            {/* Add Recommended Filters for labs comparison */}
            <RecommendedFilters
              onFilterSelect={handleFilterSelect}
              recommendedFilters={[
                "NABL Accredited",
                "Home Collection",
                "Digital Reports",
                "Open 24x7",
                "Insurance Accepted",
                "Free Home Delivery",
              ]}
              title="Quick Filters:"
              className="mb-4"
            />

            {/* Mobile Filter Button */}
            <div className="md:hidden">
              <Sheet
                open={isMobileFilterOpen}
                onOpenChange={setIsMobileFilterOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters & Sort
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs bg-primary text-white rounded-full px-2 py-0.5 mr-1">
                        {Object.values(filters.facilities).filter(Boolean)
                          .length +
                          (filters.rating > 0 ? 1 : 0) +
                          (filters.maxDistance < 10 ? 1 : 0) +
                          (filters.openNow ? 1 : 0)}
                      </span>
                      <BadgeIndianRupee className="h-4 w-4" />
                    </div>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-md p-0">
                  <div className="overflow-y-auto h-full">
                    <LabFilters
                      onSortChange={handleSortChange}
                      onFilterChange={handleFilterChange}
                      isMobile={true}
                      onClose={() => setIsMobileFilterOpen(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Filters - Desktop */}
              <div className="hidden md:block md:w-1/4 lg:w-1/5">
                <LabFilters
                  onSortChange={handleSortChange}
                  onFilterChange={handleFilterChange}
                />
              </div>

              {/* Labs Grid */}
              <div className="flex-1">
                {filteredLabs.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {filteredLabs.map((lab) => (
                      <LabCard
                        key={lab.id}
                        lab={lab}
                        onSelect={handleLabSelect}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-card border rounded-lg">
                    <h3 className="text-lg font-medium">
                      No labs match your criteria
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search for a different test.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        const resetFilters = {
                          rating: 0,
                          maxDistance: 10,
                          openNow: false,
                          facilities: Object.keys(filters.facilities).reduce(
                            (acc, facility) => ({ ...acc, [facility]: false }),
                            {} as Record<string, boolean>
                          ),
                        };
                        setFilters(resetFilters);
                        handleFilterChange(resetFilters);
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lab Selection Modal */}
        {selectedLab && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card max-w-md w-full rounded-lg shadow-lg overflow-hidden border">
              <div className="relative">
                <div
                  className="h-32 bg-cover bg-center w-full"
                  style={{
                    backgroundImage: `url(${
                      selectedLab.imageUrl || "/placeholder.svg"
                    })`,
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm hover:bg-background/70"
                  onClick={() => setSelectedLab(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
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
                    <div className="text-right">
                      {selectedLab.discount ? (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary">
                            ₹
                            {Math.round(
                              selectedLab.price -
                                (selectedLab.price * selectedLab.discount) / 100
                            )}
                          </span>
                          <span className="text-xs line-through text-muted-foreground">
                            ₹{selectedLab.price}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-1 rounded">
                            {selectedLab.discount}% off
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">
                          ₹{selectedLab.price}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Estimated wait:
                    </span>
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
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => handleViewLabDetails(selectedLab)}
                  >
                    View Details
                  </Button>
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
              2023 Ekitsa. All rights reserved.
            </p>
          </div>
          <div className="flex justify-center md:justify-end space-x-6">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LabTests;
