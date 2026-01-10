import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { FileUp, CheckCircle, ShieldCheck, AlertCircle, Loader2, Upload, Camera, CreditCard, IdCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storageService } from "@/services/storage";
import { motion } from "framer-motion";

const KycVerificationTab = () => {
  const [kycStatus, setKycStatus] = useState<"not_started" | "pending" | "verified">("not_started");
  const [documentType, setDocumentType] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      setIsUploading(true);
      const timestamp = Date.now();

      const frontUrl = await storageService.uploadImage('kyc', `${timestamp}-front-${frontImage.name}`, frontImage);
      const backUrl = await storageService.uploadImage('kyc', `${timestamp}-back-${backImage.name}`, backImage);
      const selfieUrl = await storageService.uploadImage('kyc', `${timestamp}-selfie-${selfieImage.name}`, selfieImage);

      // In a real application, this would submit the KYC data to the server
      console.log("Submitting KYC", {
        documentType,
        documentNumber,
        frontUrl,
        backUrl,
        selfieUrl
      });

      // Simulate a successful submission
      setKycStatus("pending");
      toast.success("KYC verification submitted successfully! Your verification is in progress.");
    } catch (error) {
      console.error("KYC submission error:", error);
      toast.error("Failed to upload KYC documents. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (kycStatus === "verified") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
          <CardContent className="py-16 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Verification Complete</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Your identity has been verified successfully. You now have full access to all features.
            </p>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Verified Account
            </span>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (kycStatus === "pending") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
          <CardContent className="py-16 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Loader2 className="h-10 w-10 text-amber-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification In Progress</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Your documents are being reviewed. This typically takes 24-48 hours. We'll notify you once complete.
            </p>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
              <AlertCircle className="h-4 w-4 mr-2" />
              Pending Review
            </span>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">KYC Verification</CardTitle>
              <CardDescription>
                Complete verification to unlock all features
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6 space-y-6">
            {/* Document Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <IdCard className="h-4 w-4 text-muted-foreground" />
                Document Type
              </Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="h-11 rounded-xl bg-white/50 border-slate-200">
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

            {/* Document Number */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Document Number
              </Label>
              <Input
                placeholder="Enter document number"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="h-11 rounded-xl bg-white/50 border-slate-200"
              />
            </div>

            <Separator />

            {/* Upload Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" />
                Document Images
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Front Image */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5 ${frontImage ? 'border-green-300 bg-green-50/50' : 'border-slate-200'}`}
                  onClick={() => document.getElementById('front-image')?.click()}
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 ${frontImage ? 'bg-green-100' : 'bg-slate-100'}`}>
                    {frontImage ? <CheckCircle className="h-6 w-6 text-green-600" /> : <FileUp className="h-6 w-6 text-muted-foreground" />}
                  </div>
                  <p className="text-sm font-medium text-center">{frontImage ? frontImage.name : "Front Side"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to upload</p>
                  <Input
                    id="front-image"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={handleFrontImageChange}
                  />
                </div>

                {/* Back Image */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5 ${backImage ? 'border-green-300 bg-green-50/50' : 'border-slate-200'}`}
                  onClick={() => document.getElementById('back-image')?.click()}
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 ${backImage ? 'bg-green-100' : 'bg-slate-100'}`}>
                    {backImage ? <CheckCircle className="h-6 w-6 text-green-600" /> : <FileUp className="h-6 w-6 text-muted-foreground" />}
                  </div>
                  <p className="text-sm font-medium text-center">{backImage ? backImage.name : "Back Side"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to upload</p>
                  <Input
                    id="back-image"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={handleBackImageChange}
                  />
                </div>

                {/* Selfie with Document */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5 ${selfieImage ? 'border-green-300 bg-green-50/50' : 'border-slate-200'}`}
                  onClick={() => document.getElementById('selfie-image')?.click()}
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 ${selfieImage ? 'bg-green-100' : 'bg-slate-100'}`}>
                    {selfieImage ? <CheckCircle className="h-6 w-6 text-green-600" /> : <Camera className="h-6 w-6 text-muted-foreground" />}
                  </div>
                  <p className="text-sm font-medium text-center">{selfieImage ? selfieImage.name : "Selfie"}</p>
                  <p className="text-xs text-muted-foreground mt-1 text-center">Hold your ID</p>
                  <Input
                    id="selfie-image"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleSelfieImageChange}
                  />
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
              <RadioGroup defaultValue="agree">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="agree" id="agree" className="mt-1" />
                  <Label htmlFor="agree" className="font-normal text-sm text-muted-foreground leading-relaxed">
                    I hereby declare that all the information provided is true and accurate. I understand that providing false information may result in account termination and legal consequences.
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 pt-6">
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-base font-medium transition-all hover:scale-[1.02]" 
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading Documents...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Submit Verification
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default KycVerificationTab;
