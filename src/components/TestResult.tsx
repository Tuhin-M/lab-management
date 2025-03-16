
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export interface Test {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface TestResultProps {
  test: Test;
  isSelected: boolean;
  onSelect: (test: Test) => void;
}

const TestResult = ({ test, isSelected, onSelect }: TestResultProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? "border-primary border-2" : "border"
      }`}
      onClick={() => onSelect(test)}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{test.name}</h3>
          <p className="text-muted-foreground text-sm">{test.description}</p>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full mt-2 inline-block">
            {test.category}
          </span>
        </div>
        {isSelected && (
          <div className="flex-shrink-0 bg-primary rounded-full p-1">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestResult;
