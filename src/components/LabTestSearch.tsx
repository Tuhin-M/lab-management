
import React, { useState } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LabTestSearchProps {
  tests?: any[];
  onSelect?: (test: any) => void;
  selectedTests?: any[];
}

const LabTestSearch: React.FC<LabTestSearchProps> = ({ 
  tests = [], 
  onSelect, 
  selectedTests = [] 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTests = searchQuery.trim() 
    ? tests.filter(test => 
        test.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : tests;

  // Check if a test is already selected
  const isSelected = (testId: string) => selectedTests.some(t => t.id === testId);

  return (
    <div className="bg-card rounded-lg border-0 p-0">
      <h2 className="text-xl font-bold mb-4">Search for Tests</h2>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for tests (e.g., CBC, Sugar, Thyroid)..."
          className="pl-10 h-12 bg-white/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[300px] border rounded-xl bg-white/40">
        <div className="p-2 space-y-2">
          {filteredTests.map((test, index) => {
             const selected = isSelected(test.id);
             return (
              <div key={test.id || index} className={`flex items-center justify-between p-3 hover:bg-white/60 rounded-xl transition-all border ${selected ? 'border-primary/20 bg-primary/5' : 'border-transparent'}`}>
                <div className="flex items-center">
                  <CheckCircle className={`h-4 w-4 mr-3 flex-shrink-0 ${selected ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="text-sm font-bold text-gray-800">{test.name}</p>
                    <p className="text-xs text-muted-foreground">₹{test.price}</p>
                  </div>
                </div>
                <Button
                  variant={selected ? "secondary" : "outline"}
                  size="sm"
                  className={selected ? "bg-green-100 text-green-700 hover:bg-green-200" : "border-primary/20 text-primary hover:bg-primary hover:text-white"}
                  onClick={() => onSelect?.(test)}
                >
                  {selected ? "Added" : "Add"}
                </Button>
              </div>
            );
          })}
          {filteredTests.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No tests found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LabTestSearch;
