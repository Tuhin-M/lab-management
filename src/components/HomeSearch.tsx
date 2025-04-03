
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, TestTube, User, Calendar } from "lucide-react";
import CitySelection from "@/components/CitySelection";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface HomeSearchProps {
  className?: string;
}

const HomeSearch: React.FC<HomeSearchProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchType, setSearchType] = useState<"labs" | "doctors">("labs");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCity) params.append("city", selectedCity);
    if (searchQuery) params.append("query", searchQuery);
    if (selectedDate) params.append("date", format(selectedDate, "yyyy-MM-dd"));
    
    if (searchType === "labs") {
      navigate(`/lab-tests?${params.toString()}`);
    } else {
      navigate(`/doctors?${params.toString()}`);
    }
  };

  return (
    <Card className={`shadow-md ${className}`}>
      <CardContent className="p-6">
        <Tabs 
          defaultValue="labs" 
          className="w-full"
          onValueChange={(value) => setSearchType(value as "labs" | "doctors")}
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="labs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
              <TestTube className="h-4 w-4 mr-2" /> Lab Tests
            </TabsTrigger>
            <TabsTrigger value="doctors" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
              <User className="h-4 w-4 mr-2" /> Doctors
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <CitySelection 
                selectedCity={selectedCity} 
                onCityChange={setSelectedCity} 
                className="w-full md:w-auto"
              />
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-12 w-full md:w-[200px] justify-start text-left border-primary/20 focus:ring-primary",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <div className="relative flex-grow">
                <Search className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={searchType === "labs" ? "Search for tests or health packages" : "Search for doctors or specialties"}
                  className="pl-10 h-12 w-full rounded-md border border-primary/20 focus:ring-primary focus:outline-none focus:ring-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Button onClick={handleSearch} className="w-full h-12 text-base">
              <Search className="mr-2 h-5 w-5" />
              {searchType === "labs" ? "Search Lab Tests" : "Find Doctors"}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HomeSearch;
