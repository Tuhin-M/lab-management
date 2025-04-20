
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { FileUp, CheckCircle, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const KycVerificationTab = () => {
  const [kycStatus, setKycStatus] = useState<"not_started" | "pending" | "verified">("not_started");
  const [documentType, setDocumentType] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);

  const handleFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFrontImage(e.target.files[0]);
    }
  };

  const handleBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackImage(e.target.files[0]);
    }
  };

  const handleSelfieImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelfieImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentType) {
      toast.error("Please select a document type");
      return;
    }
    
    if (!documentNumber) {
      toast.error("Please enter document number");
      return;
    }
    
    if (!frontImage || !backImage || !selfieImage) {
      toast.error("Please upload all required documents");
      return;
    }
    
    // In a real application, this would submit the KYC data to the server
    console.log("Submitting KYC", { documentType, documentNumber, frontImage, backImage, selfieImage });
    
    // Simulate a successful submission
    setKycStatus("pending");
    toast.success("KYC verification submitted successfully! Your verification is in progress.");
  };

  if (kycStatus === "verified") {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>KYC Verification Complete</CardTitle>
          <CardDescription>
            Your identity has been verified successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center py-6">
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full inline-flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Verified
            </span>
          </div>
          <p className="text-muted-foreground">
            Your account has been fully verified and you have access to all features.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (kycStatus === "pending") {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle>KYC Verification Pending</CardTitle>
          <CardDescription>
            Your verification is currently being processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center py-6">
            <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full inline-flex items-center">
              <svg className="h-4 w-4 mr-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing
            </span>
          </div>
          <p className="text-muted-foreground">
            This usually takes 24-48 hours. We'll notify you once your verification is complete.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
          KYC Verification
        </CardTitle>
        <CardDescription>
          Complete your KYC verification to unlock all features and enhance account security.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger id="document-type">
                <SelectValue placeholder="Select ID document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aadhar">Aadhar Card</SelectItem>
                <SelectItem value="pan">PAN Card</SelectItem>
                <SelectItem value="voter">Voter ID</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="driving">Driving License</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document-number">Document Number</Label>
            <Input 
              id="document-number" 
              placeholder="Enter document number" 
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Document Images</h3>
            
            <div className="space-y-2">
              <Label htmlFor="front-image">Front Side of Document</Label>
              <div 
                className="border-2 border-dashed rounded-md p-6 flex flex-col items-center cursor-pointer hover:border-primary/50 transition-colors" 
                onClick={() => document.getElementById('front-image')?.click()}
              >
                <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  {frontImage ? frontImage.name : "Click to upload front side"}
                </p>
              </div>
              <Input 
                id="front-image" 
                type="file" 
                accept=".jpg,.jpeg,.png,.pdf" 
                className="hidden" 
                onChange={handleFrontImageChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="back-image">Back Side of Document</Label>
              <div 
                className="border-2 border-dashed rounded-md p-6 flex flex-col items-center cursor-pointer hover:border-primary/50 transition-colors" 
                onClick={() => document.getElementById('back-image')?.click()}
              >
                <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  {backImage ? backImage.name : "Click to upload back side"}
                </p>
              </div>
              <Input 
                id="back-image" 
                type="file" 
                accept=".jpg,.jpeg,.png,.pdf" 
                className="hidden" 
                onChange={handleBackImageChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="selfie-image">Selfie with Document</Label>
              <div 
                className="border-2 border-dashed rounded-md p-6 flex flex-col items-center cursor-pointer hover:border-primary/50 transition-colors" 
                onClick={() => document.getElementById('selfie-image')?.click()}
              >
                <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  {selfieImage ? selfieImage.name : "Click to upload selfie with document"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Take a photo of yourself holding your ID document
                </p>
              </div>
              <Input 
                id="selfie-image" 
                type="file" 
                accept=".jpg,.jpeg,.png" 
                className="hidden" 
                onChange={handleSelfieImageChange}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Declaration</h3>
            <RadioGroup defaultValue="agree">
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="agree" id="agree" />
                <Label htmlFor="agree" className="font-normal text-sm">
                  I hereby declare that all the information provided is true and accurate. I understand that providing false information may result in account termination and legal consequences.
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Submit Verification</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default KycVerificationTab;
