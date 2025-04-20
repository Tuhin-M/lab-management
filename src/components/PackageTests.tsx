
import React, { useState } from "react";
import { Search, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PackageTestsProps {
  tests: string[];
  packageName: string;
}

const PackageTests = ({ tests, packageName }: PackageTestsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTests = searchQuery.trim() 
    ? tests.filter(test => test.toLowerCase().includes(searchQuery.toLowerCase()))
    : tests;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-primary p-0 h-auto text-xs font-medium">
          View all {tests.length} tests
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tests included in {packageName}</DialogTitle>
        </DialogHeader>
        <div className="my-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tests..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="mt-2 max-h-[60vh]">
          <div className="space-y-2 p-1">
            {filteredTests.map((test, index) => (
              <div key={index} className="flex items-start p-2 hover:bg-secondary rounded-md">
                <Check className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                <span className="text-sm">{test}</span>
              </div>
            ))}
            {filteredTests.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tests found matching "{searchQuery}"
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PackageTests;
