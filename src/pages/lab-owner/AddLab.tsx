
import React from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload } from "lucide-react";
import { labOwnerAPI } from "@/services/api";
import { storageService } from "@/services/storage";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const labSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  address: z.object({
    street: z.string().min(1, { message: "Street is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    zipCode: z.string().min(1, { message: "Zip code is required" })
  }),
  contactInfo: z.object({
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    email: z.string().email({ message: "Invalid email address" }),
    website: z.string().optional()
  }),
  certifications: z.string()
});

type LabFormValues = z.infer<typeof labSchema>;

const AddLab = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const form = useForm<LabFormValues>({
    resolver: zodResolver(labSchema),
    defaultValues: {
      name: "",
      description: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: ""
      },
      contactInfo: {
        phone: "",
        email: "",
        website: ""
      },
      certifications: ""
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: LabFormValues) => {
    try {
      let imageUrl = null;
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        imageUrl = await storageService.uploadImage('labs', fileName, imageFile);
      }

      const payload = {
        ...data,
        image: imageUrl || 'default-lab.jpg'
      };

      const res = await fetch('/api/labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to add lab');
      toast.success('Lab added successfully');
      navigate('/lab-dashboard');
    } catch (error) {
      console.error('Failed to add lab:', error);
      toast.error('Failed to add lab. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="container max-w-4xl mx-auto px-6 py-12 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <Button
              variant="ghost"
              className="mb-4 -ml-4 hover:bg-transparent text-slate-500 hover:text-primary transition-colors group"
              onClick={() => navigate("/lab-dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Add New Laboratory</h1>
            <p className="text-slate-500 mt-2 text-lg">Register your facility to start managing tests and appointments.</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-primary/5 border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Upload size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Quick Setup</p>
                <p className="text-xs text-slate-500">Takes less than 2 minutes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardContent className="p-8 md:p-10">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">1</div>
                        <h3 className="text-xl font-bold text-slate-900">Lab Identity</h3>
                      </div>

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold">Laboratory Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Apollo Diagnostics"
                                className="h-12 rounded-xl border-slate-200 focus:ring-primary/20 bg-slate-50/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold">Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell patients about your specialties and expertise..."
                                className="min-h-[120px] rounded-xl border-slate-200 focus:ring-primary/20 bg-slate-50/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">2</div>
                        <h3 className="text-xl font-bold text-slate-900">Contact & Location</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="contactInfo.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold">Business Email</FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                                  placeholder="contact@lab.com"
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
                              <FormLabel className="text-slate-700 font-semibold">Primary Phone</FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                                  placeholder="+91-XXXXX-XXXXX"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold">Street Address</FormLabel>
                            <FormControl>
                              <Input className="h-12 rounded-xl border-slate-200 bg-slate-50/50" placeholder="Room no, Street, Area" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2">
                          <FormField
                            control={form.control}
                            name="address.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700 font-semibold">City</FormLabel>
                                <FormControl>
                                  <Input className="h-12 rounded-xl border-slate-200 bg-slate-50/50" placeholder="Mumbai" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="address.zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold">PIN Code</FormLabel>
                              <FormControl>
                                <Input className="h-12 rounded-xl border-slate-200 bg-slate-50/50" placeholder="400001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-xl h-12 px-8 text-slate-500"
                        onClick={() => navigate("/lab-dashboard")}
                      >
                        Discard Changes
                      </Button>
                      <Button type="submit" className="rounded-xl h-12 px-10 shadow-xl shadow-primary/20 font-bold active:scale-95 transition-all">
                        Register Laboratory
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Media Upload</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => document.getElementById('lab-image')?.click()}
                >
                  <div className={`aspect-video rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 ${imagePreview ? 'border-transparent' : 'border-slate-200 bg-slate-50 group-hover:bg-primary/5 group-hover:border-primary/50'}`}>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="absolute inset-0 h-full w-full object-cover rounded-2xl shadow-inner"
                      />
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="text-slate-400 group-hover:text-primary" size={20} />
                        </div>
                        <p className="text-xs font-semibold text-slate-500 group-hover:text-primary">Click to upload photo</p>
                      </>
                    )}
                  </div>
                  <input placeholder="Enter value" title="Enter value"
                    type="file"
                    id="lab-image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-4 text-center">Recommended size: 1200x800px. JPG, PNG formats supported.</p>
              </CardContent>
            </Card>

            <Card className="border-none bg-primary text-primary-foreground shadow-2xl shadow-primary/20 rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h4 className="font-bold text-lg mb-2">Need Assistance?</h4>
                <p className="text-xs text-primary-foreground/70 mb-6 leading-relaxed">Our support team is available 24/7 to help you set up your digital laboratory profile.</p>
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
