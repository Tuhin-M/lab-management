
import React from "react";
import { Check, Shield, BadgePercent } from "lucide-react";
import PackageTests from "./PackageTests";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface TestPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  tests: string[];
  includedTestCount: number;
  isPopular?: boolean;
  category: string;
  imageUrl?: string;
}

interface TestPackageProps {
  testPackage: TestPackage;
  onSelect: (testPackage: TestPackage) => void;
}

const TestPackage = ({ testPackage, onSelect }: TestPackageProps) => {
  const discountedPrice = testPackage.discount 
    ? Math.round(testPackage.price - (testPackage.price * testPackage.discount / 100)) 
    : testPackage.price;
    
  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg border border-border relative">
      {testPackage.isPopular && (
        <div className="absolute top-0 right-0">
          <Badge className="m-2 bg-primary text-white">Popular</Badge>
        </div>
      )}
      
      {testPackage.imageUrl && (
        <div 
          className="h-32 bg-cover bg-center w-full" 
          style={{ backgroundImage: `url(${testPackage.imageUrl})` }}
        />
      )}
      
      <CardHeader className={`p-4 pb-0 ${!testPackage.imageUrl ? 'pt-10' : ''}`}>
        <CardTitle className="text-lg font-semibold">{testPackage.name}</CardTitle>
        <Badge variant="outline" className="w-fit bg-secondary/50 font-normal">
          {testPackage.category}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-4">{testPackage.description}</p>
        
        <div className="space-y-2">
          <div className="text-sm">
            <p className="font-medium mb-1">Includes:</p>
            <ul className="space-y-1">
              {testPackage.tests.slice(0, 3).map((test, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-3 w-3 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-xs">{test}</span>
                </li>
              ))}
            </ul>
            {testPackage.includedTestCount > 3 && (
              <div className="text-xs text-primary mt-1 font-medium">
                <PackageTests tests={testPackage.tests} packageName={testPackage.name} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col items-start">
        <div className="mb-3 w-full flex items-center justify-between">
          {testPackage.discount ? (
            <div className="flex items-center gap-2">
              <p className="font-bold text-xl text-primary">₹{discountedPrice}</p>
              <div className="flex flex-col">
                <p className="text-xs line-through text-muted-foreground">₹{testPackage.price}</p>
                <div className="flex items-center">
                  <BadgePercent className="h-3 w-3 text-primary mr-1" />
                  <p className="text-xs text-primary font-medium">{testPackage.discount}% off</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="font-bold text-xl">₹{testPackage.price}</p>
          )}
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary/90" 
          onClick={() => onSelect(testPackage)}
        >
          Select Package
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestPackage;
