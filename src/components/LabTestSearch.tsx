
import React, { useState } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data for available tests in the lab
const allLabTests = [
  { name: "Complete Blood Count (CBC)", available: true, price: 699 },
  { name: "Hemoglobin", available: true, price: 299 },
  { name: "Blood Glucose Fasting", available: true, price: 199 },
  { name: "Lipid Profile", available: true, price: 899 },
  { name: "Liver Function Test", available: true, price: 1299 },
  { name: "Kidney Function Test", available: true, price: 1199 },
  { name: "Thyroid Profile", available: true, price: 1599 },
  { name: "Vitamin B12", available: true, price: 899 },
  { name: "Vitamin D3", available: false, price: 1299 },
  { name: "HbA1c", available: true, price: 799 },
  { name: "Urine Routine Examination", available: true, price: 299 },
  { name: "SGPT/ALT", available: true, price: 299 },
  { name: "SGOT/AST", available: true, price: 299 },
  { name: "Serum Creatinine", available: true, price: 299 },
  { name: "Serum Uric Acid", available: false, price: 399 },
  { name: "HIV Test", available: true, price: 599 },
  { name: "Dengue Test", available: true, price: 899 },
  { name: "Malaria Test", available: false, price: 699 },
  { name: "COVID-19 RT-PCR Test", available: true, price: 1499 },
  { name: "Chest X-Ray", available: false, price: 599 },
  { name: "USG Abdomen", available: false, price: 1999 },
  { name: "ECG", available: true, price: 499 },
  { name: "2D Echo", available: false, price: 2999 },
  { name: "Allergy Profile", available: true, price: 3999 },
  { name: "Blood Group", available: true, price: 199 },
];

const LabTestSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  
  const filteredTests = searchQuery.trim() 
    ? allLabTests.filter(test => 
        test.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allLabTests;

  const handleAddTest = (testName: string) => {
    if (!selectedTests.includes(testName)) {
      setSelectedTests([...selectedTests, testName]);
    }
  };

  const handleRemoveTest = (testName: string) => {
    setSelectedTests(selectedTests.filter(test => test !== testName));
  };

  return (
    <div className="bg-card rounded-lg border p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Search for Tests</h2>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for tests (e.g., CBC, Sugar, Thyroid)..."
          className="pl-10 h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {selectedTests.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Selected Tests:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTests.map(test => (
              <Badge 
                key={test} 
                variant="outline" 
                className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1"
              >
                {test}
                <button 
                  className="ml-1 rounded-full hover:bg-primary/20 p-0.5"
                  onClick={() => handleRemoveTest(test)}
                >
                  <XCircle className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="h-[300px] border rounded-md">
        <div className="p-2">
          {filteredTests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-secondary rounded-md">
              <div className="flex items-center">
                {test.available ? (
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive mr-2 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium">{test.name}</p>
                  <p className="text-xs text-muted-foreground">₹{test.price}</p>
                </div>
              </div>
              <Button
                variant={test.available ? "outline" : "ghost"}
                size="sm"
                disabled={!test.available}
                className={test.available ? "border-primary text-primary hover:bg-primary hover:text-white" : ""}
                onClick={() => test.available && handleAddTest(test.name)}
              >
                {test.available ? "Add" : "Unavailable"}
              </Button>
            </div>
          ))}
          {filteredTests.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">
              No tests found matching "{searchQuery}"
            </p>
          )}
        </div>
      </ScrollArea>
      
      {selectedTests.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button className="bg-primary hover:bg-primary/90">
            Book Selected Tests
          </Button>
        </div>
      )}
    </div>
  );
};

export default LabTestSearch;
