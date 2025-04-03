
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Test {
  id: string;
  name: string;
  description: string;
  category: string;
  price?: number;
  discount?: number;
  isPopular?: boolean;
}

interface TestResultProps {
  test: Test;
  isSelected: boolean;
  onSelect: (test: Test) => void;
}

const TestResult = ({ test, isSelected, onSelect }: TestResultProps) => {
  // Check if both price and discount exist before calculating
  const hasDiscount = test && typeof test.price === 'number' && typeof test.discount === 'number';
  const discountPrice = hasDiscount 
    ? test.price! - (test.price! * test.discount! / 100) 
    : undefined;
  
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? "border-primary border-2" : "border"
      }`}
      onClick={() => onSelect(test)}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-lg">{test.name}</h3>
            {test.isPopular && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Popular
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">{test.description}</p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs bg-secondary px-2 py-1 rounded-full mt-1 inline-block">
              {test.category}
            </span>
            
            {typeof test.price === 'number' && (
              <div className="text-right">
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs line-through text-muted-foreground">₹{test.price}</span>
                    <span className="text-xs bg-primary/10 text-primary px-1 rounded">
                      {test.discount}% off
                    </span>
                  </div>
                )}
                <p className="font-bold text-base">
                  ₹{discountPrice || test.price}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {isSelected && (
          <div className="flex-shrink-0 bg-primary rounded-full p-1 ml-3">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestResult;
