
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload, Loader2, X, FlaskConical, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { labOwnerAPI, labsAPI, LabCreateRequest } from "@/services/api";
import { storageService } from "@/services/storage";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { INDIAN_STATES, getCitiesByState } from "@/data/indianLocations";
import { DEFAULT_LAB_IMAGE } from "@/constants/images";

// --- Validation Schema ---
const labSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Lab name must be at least 2 characters" })
    .max(100, { message: "Lab name must not exceed 100 characters" })
    .regex(/^[a-zA-Z0-9\s\-&.,']+$/, { message: "Name can only contain letters, numbers, spaces, and basic punctuation" }),
  type: z.string({ required_error: "Please select a lab type" }).min(1, { message: "Lab Type is required" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" })
    .max(500, { message: "Description must not exceed 500 characters" }),
  address: z.object({
    street: z
      .string()
      .min(5, { message: "Street address must be at least 5 characters" })
      .max(200, { message: "Street address too long" }),
    city: z
      .string({ required_error: "Please select a city" })
      .min(1, { message: "City is required" }),
    state: z.string({ required_error: "Please select a state" }).min(1, { message: "State is required" }),
    zipCode: z
      .string()
      .regex(/^\d{6}$/, { message: "PIN code must be exactly 6 digits (e.g. 400001)" }),
  }),
  contactInfo: z.object({
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, { message: "Enter a valid 10-digit Indian mobile number starting with 6–9" }),
    email: z
      .string()
      .email({ message: "Enter a valid email address (e.g. contact@lab.com)" }),
    website: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(val),
        { message: "Enter a valid website URL (e.g. www.yourlab.com)" }
      ),
  }),
  certifications: z.string().optional(),
});

type LabFormValues = z.infer<typeof labSchema>;

const AddLab = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [labImages, setLabImages] = useState<File[]>([]);
  const [labImagePreviews, setLabImagePreviews] = useState<string[]>([]);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLab, setIsLoadingLab] = useState(false);

  const form = useForm<LabFormValues>({
    resolver: zodResolver(labSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      type: "",
      description: "",
      address: { street: "", city: "", state: "", zipCode: "" },
      contactInfo: { phone: "", email: "", website: "" },
      certifications: "",
    },
  });

  const selectedState = form.watch("address.state");
  const availableCities = selectedState ? getCitiesByState(selectedState) : [];

  // Load existing lab data if editing
  useEffect(() => {
    if (!id) return;

    const fetchLabDetails = async () => {
      try {
        setIsLoadingLab(true);
        const lab = await labsAPI.getLabById(id);
        if (lab) {
          form.reset({
            name: lab.name || "",
            type: lab.type || "Diagnostic",
            description: lab.description || "",
            address: {
              street: lab.address_street || lab.address?.street || "",
              city: lab.address_city || lab.address?.city || "",
              state: lab.address_state || lab.address?.state || "",
              zipCode: lab.address_zip || lab.address?.zipCode || "",
            },
            contactInfo: {
              phone: lab.phone || lab.contact?.phone || "",
              email: lab.email || lab.contact?.email || "",
              website: lab.website || lab.contact?.website || "",
            },
            certifications: Array.isArray(lab.certifications)
              ? lab.certifications.join(", ")
              : (Array.isArray(lab.facilities) ? lab.facilities.join(", ") : ""),
          });

          if (lab.image_url) {
            setExistingImage(lab.image_url);
          }
        }
      } catch (error) {
        console.error("Failed to load lab details:", error);
        toast.error("Failed to load existing lab details");
      } finally {
        setIsLoadingLab(false);
      }
    };

    fetchLabDetails();
  }, [id, form]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Logo must be a JPG, PNG, or WebP image");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo file size must be under 2 MB");
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleLabImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (labImages.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 lab photos");
      return;
    }
    const validFiles = files.filter((f) => {
      if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
        toast.error(`${f.name} is not a supported image format`);
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} exceeds the 5 MB size limit`);
        return false;
      }
      return true;
    });
    setLabImages((prev) => [...prev, ...validFiles]);
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setLabImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeLabImage = (index: number) => {
    setLabImages((prev) => prev.filter((_, i) => i !== index));
    setLabImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: LabFormValues) => {
    setIsSubmitting(true);
    try {
      let logoUrl = null;
      if (logoFile) {
        const fileName = `${Date.now()}-logo-${logoFile.name}`;
        logoUrl = await storageService.uploadImage("labs", fileName, logoFile);
      }

      const labImageUrls: string[] = [];
      for (const file of labImages) {
        const fileName = `${Date.now()}-lab-${file.name}`;
        const url = await storageService.uploadImage("labs", fileName, file);
        if (url) labImageUrls.push(url);
      }

      const primaryImage =
        labImageUrls.length > 0
          ? labImageUrls[0]
          : logoUrl || existingImage || DEFAULT_LAB_IMAGE;

      if (isEditMode && id) {
        await labOwnerAPI.updateLab(id, {
          name: data.name,
          type: data.type,
          description: data.description,
          address: {
            street: data.address.street,
            city: data.address.city,
            state: data.address.state,
            zipCode: data.address.zipCode,
          },
          contact: {
            email: data.contactInfo.email,
            phone: data.contactInfo.phone,
            website: data.contactInfo.website || "",
          },
          certifications: data.certifications
            ? data.certifications.split(",").map((c: string) => c.trim()).filter(Boolean)
            : [],
          image_url: primaryImage,
        });

        toast.success("Lab details updated successfully!");
        navigate(`/lab-owner/lab/${id}`);
      } else {
        const payload: LabCreateRequest = {
          name: data.name,
          type: data.type,
          description: data.description,
          establishedDate: "",
          registrationNumber: "",
          address: {
            street: data.address.street,
            city: data.address.city,
            state: data.address.state,
            zipCode: data.address.zipCode,
            country: "India",
            landmark: "",
          },
          contact: {
            email: data.contactInfo.email,
            phone: data.contactInfo.phone,
            website: data.contactInfo.website || "",
            emergencyContact: "",
          },
          facilities: [],
          certifications: data.certifications ? [data.certifications] : [],
          workingHours: {
            weekdays: "09:00 - 18:00",
            weekends: "10:00 - 14:00",
            holidays: "Closed",
          },
          staff: { pathologists: 0, technicians: 0, receptionists: 0 },
          services: [],
          image_url: primaryImage,
        };

        await labOwnerAPI.addLab(payload);
        toast.success("Lab registered successfully!");
        navigate("/lab-dashboard");
      }
    } catch (error) {
      console.error("Failed to save lab:", error);
      toast.error(isEditMode ? "Failed to update lab details." : "Failed to register lab.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const SectionHeader = ({ step, title, icon }: { step: string; title: string; icon: React.ReactNode }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
        {step}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-400">{icon}</span>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      </div>
    </div>
  );

  if (isLoadingLab) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-t-2 border-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading lab details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden pt-20">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="container max-w-4xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Button
              variant="ghost"
              className="mb-4 -ml-4 hover:bg-transparent text-slate-500 hover:text-primary transition-colors group"
              onClick={() => isEditMode ? navigate(`/lab-owner/lab/${id}`) : navigate("/lab-dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {isEditMode ? "Back to Lab Details" : "Back to Dashboard"}
            </Button>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              {isEditMode ? "Edit Laboratory Details" : "Register Your Laboratory"}
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              {isEditMode
                ? "Update your facility information, location, and contact parameters."
                : "Fields marked with * are required."}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-primary/5 border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                {isEditMode ? <CheckCircle2 size={24} /> : <Upload size={24} />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{isEditMode ? "Active Facility" : "Quick Setup"}</p>
                <p className="text-xs text-slate-500">{isEditMode ? "Ready to update" : "Takes less than 2 minutes"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardContent className="p-8 md:p-10">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

                    {/* Section 1: Lab Identity */}
                    <div className="space-y-6">
                      <SectionHeader step="1" title="Lab Identity" icon={<FlaskConical size={18} />} />

                      {/* Logo Upload */}
                      <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <h4 className="font-semibold text-slate-700 mb-4">Lab Logo <span className="text-slate-400 font-normal text-xs">(optional · max 2 MB)</span></h4>
                        <div className="flex items-start gap-6">
                          <div
                            className="relative group cursor-pointer w-32 h-32 flex-shrink-0"
                            onClick={() => document.getElementById("lab-logo")?.click()}
                          >
                            <div className={`w-full h-full rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-2 ${logoPreview ? "border-transparent" : "border-slate-300 bg-white hover:border-primary/50"}`}>
                              {logoPreview ? (
                                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain rounded-xl" />
                              ) : (
                                <>
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                                    <Upload className="text-slate-400" size={16} />
                                  </div>
                                  <p className="text-[10px] text-center font-medium text-slate-500">Upload Logo</p>
                                </>
                              )}
                            </div>
                            <input type="file" id="lab-logo" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleLogoChange} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-600 mb-2">Upload your official lab logo displayed on your profile and reports.</p>
                            <p className="text-xs text-slate-400">JPG, PNG or WebP · Square recommended (500×500 px)</p>
                          </div>
                        </div>
                      </div>

                      {/* Name & Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold">
                                Laboratory Name <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Apollo Diagnostics"
                                  className="h-12 rounded-xl border-slate-200 focus:ring-primary/20 bg-slate-50/50"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-xs text-slate-400">2–100 characters. Letters, numbers, and basic punctuation only.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold">
                                Lab Type <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-primary/20 bg-slate-50/50">
                                    <SelectValue placeholder="Select lab type" />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl border-slate-200">
                                    <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                                    <SelectItem value="Pathology">Pathology</SelectItem>
                                    <SelectItem value="Imaging">Imaging</SelectItem>
                                    <SelectItem value="Specialty">Specialty</SelectItem>
                                    <SelectItem value="Hospital">Hospital</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Description */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold">
                              Description <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your lab's specialties, services, and what makes you stand out for patients..."
                                className="min-h-[120px] rounded-xl border-slate-200 focus:ring-primary/20 bg-slate-50/50"
                                maxLength={500}
                                {...field}
                              />
                            </FormControl>
                            <div className="flex justify-between items-center">
                              <FormMessage />
                              <span className={`text-xs ml-auto ${field.value?.length > 480 ? "text-red-400" : "text-slate-400"}`}>
                                {field.value?.length || 0}/500
                              </span>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Section 2: Contact & Location */}
                    <div className="space-y-6">
                      <SectionHeader step="2" title="Contact & Location" icon={<MapPin size={18} />} />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="contactInfo.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold">
                                Business Email <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                                  placeholder="contact@yourlab.com"
                                  type="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="contactInfo.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold">
                                Primary Phone <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                                  placeholder="9876543210"
                                  maxLength={10}
                                  {...field}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    field.onChange(val);
                                  }}
                                />
                              </FormControl>
                              <FormDescription className="text-xs text-slate-400">10-digit Indian mobile number, no spaces or dashes.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="contactInfo.website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold">
                              Website <span className="text-slate-400 font-normal text-xs">(optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                                placeholder="www.yourlab.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold">
                              Street Address <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                                placeholder="Building no, Street name, Area/Locality"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="address.state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold">
                                State <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(val) => {
                                    field.onChange(val);
                                    form.setValue("address.city", "", { shouldValidate: true });
                                  }}
                                  value={field.value}
                                >
                                  <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50">
                                    <SelectValue placeholder="Select state" />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl border-slate-200 max-h-64 overflow-y-auto">
                                    {INDIAN_STATES.map((state) => (
                                      <SelectItem key={state} value={state}>{state}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address.city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold">
                                City <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={!selectedState}
                                >
                                  <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50">
                                    <SelectValue placeholder={selectedState ? "Select city" : "Select state first"} />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl border-slate-200 max-h-64 overflow-y-auto">
                                    {availableCities.map((city) => (
                                      <SelectItem key={city} value={city}>{city}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address.zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold">
                                PIN Code <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                                  placeholder="400001"
                                  maxLength={6}
                                  {...field}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    field.onChange(val);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Section 3: Certifications (optional) */}
                    <div className="space-y-6">
                      <SectionHeader step="3" title="Certifications" icon={<Phone size={18} />} />
                      <FormField
                        control={form.control}
                        name="certifications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold">
                              Certifications / Accreditations <span className="text-slate-400 font-normal text-xs">(optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                                placeholder="e.g. NABL, ISO 15189, CAP"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-xs text-slate-400">
                              List your lab's accreditations separated by commas.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit */}
                    <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-xl h-12 px-8 text-slate-500"
                        onClick={() => navigate("/lab-dashboard")}
                        disabled={isSubmitting}
                      >
                        Discard
                      </Button>
                      <Button
                        type="submit"
                        className="rounded-xl h-12 px-10 shadow-xl shadow-primary/20 font-bold active:scale-95 transition-all"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isEditMode ? "Saving Changes..." : "Registering..."}
                          </>
                        ) : (
                          isEditMode ? "Save Changes" : "Register Laboratory"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-6">
                <h4 className="font-bold text-slate-800 mb-4">Lab Photos <span className="text-slate-400 font-normal text-xs">(max 5)</span></h4>
                <div className="grid grid-cols-1 gap-4">
                  {existingImage && labImagePreviews.length === 0 && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={existingImage} alt="Current Lab Photo" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                        Current Photo
                      </div>
                    </div>
                  )}
                  {labImagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden group">
                      <img src={preview} alt={`Lab ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeLabImage(index)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {labImages.length < 5 && (
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => document.getElementById("lab-images")?.click()}
                    >
                      <div className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 group-hover:bg-primary/5 group-hover:border-primary/50 transition-all flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="text-slate-400 group-hover:text-primary" size={20} />
                        </div>
                        <p className="text-xs font-semibold text-slate-500 group-hover:text-primary">Click to upload lab photos</p>
                        <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WebP · max 5 MB each</p>
                      </div>
                      <input
                        type="file"
                        id="lab-images"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleLabImagesChange}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-primary text-primary-foreground shadow-2xl shadow-primary/20 rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h4 className="font-bold text-lg mb-2">Need Assistance?</h4>
                <p className="text-xs text-primary-foreground/70 mb-6 leading-relaxed">
                  Our support team is available 24/7 to help you set up your digital laboratory profile.
                </p>
                <Button variant="link" className="p-0 h-auto text-white font-bold text-sm underline decoration-white/30 hover:decoration-white">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLab;
