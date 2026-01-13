import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Info, Trash, ArrowLeft } from "lucide-react";
import { labOwnerAPI } from "@/services/api";

const testSchema = z.object({
  name: z.string().min(2, { message: "Test name must be at least 2 characters" }),
  category: z.string().min(2, { message: "Category is required" }),
  sampleType: z.enum(["Blood", "Urine", "Saliva", "Other"], { required_error: "Select sample type" }),
  price: z.number().min(1, { message: "Price must be a positive number" }),
  discount: z.number().min(0).max(100).optional(),
  turnaroundTime: z.string().min(1, { message: "Turnaround time is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  parameters: z.array(z.object({ name: z.string().min(1, { message: "Parameter required" }) })).min(1, { message: "At least one parameter required" })
});

type TestFormValues = z.infer<typeof testSchema>;

const AddTest = () => {
  const navigate = useNavigate();
  const { labId } = useParams<{ labId: string }>();

  const form = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: "",
      category: "",
      sampleType: "Blood",
      price: 0,
      discount: 0,
      turnaroundTime: "",
      duration: "",
      description: "",
      parameters: [{ name: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "parameters" });

  const onSubmit = async (data: TestFormValues) => {
    if (!labId) {
      toast.error("Lab ID is missing. Please try again from the lab dashboard.");
      return;
    }
    try {
      await labOwnerAPI.addTestToLab(labId, data);
      toast.success("Test added successfully");
      navigate(`/lab-owner/lab/${labId}`);
    } catch (error) {
      console.error("Failed to add test:", error);
      toast.error("Failed to add test. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col pt-20 pb-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="container max-w-2xl mx-auto px-4 relative z-10">
        <Button
          variant="ghost"
          className="mb-6 flex items-center text-slate-500 hover:text-primary transition-colors group px-0"
          onClick={() => navigate(-1)}
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-3 group-hover:bg-primary group-hover:text-white transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="font-semibold">Back to Lab</span>
        </Button>

        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-slate-100 p-8 pt-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                <Info size={24} />
              </div>
              <div>
                <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">Add New Test</CardTitle>
                <p className="text-slate-500 font-medium">Define parameters and pricing for your new lab test.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">Test Name</Label>
                    <Input id="name" {...form.register("name")} placeholder="e.g. Complete Blood Count" className="h-12 rounded-xl border-slate-200 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-bold text-slate-700 ml-1">Category</Label>
                    <Input id="category" {...form.register("category")} placeholder="e.g. Hematology" className="h-12 rounded-xl border-slate-200 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">Sample Type</Label>
                    <Controller
                      control={form.control}
                      name="sampleType"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-primary/20">
                            <SelectValue placeholder="Select sample type" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-200">
                            <SelectItem value="Blood">Blood</SelectItem>
                            <SelectItem value="Urine">Urine</SelectItem>
                            <SelectItem value="Saliva">Saliva</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-bold text-slate-700 ml-1 flex items-center">
                      Price (₹)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={14} className="ml-1.5 text-slate-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="rounded-lg">Base price in INR</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input id="price" {...form.register("price", { valueAsNumber: true })} placeholder="0.00" type="number" className="h-12 rounded-xl border-slate-200 focus:ring-primary/20 font-bold text-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount" className="text-sm font-bold text-slate-700 ml-1">Discount (%)</Label>
                    <Input id="discount" {...form.register("discount", { valueAsNumber: true })} placeholder="0" type="number" className="h-12 rounded-xl border-slate-200 focus:ring-primary/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="turnaroundTime" className="text-sm font-bold text-slate-700 ml-1">TAT</Label>
                      <Input id="turnaroundTime" {...form.register("turnaroundTime")} placeholder="12h" className="h-12 rounded-xl border-slate-200 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-sm font-bold text-slate-700 ml-1">Duration</Label>
                      <Input id="duration" {...form.register("duration")} placeholder="1d" className="h-12 rounded-xl border-slate-200 focus:ring-primary/20" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-bold text-slate-700 ml-1">Description</Label>
                <Textarea id="description" {...form.register("description")} placeholder="Detailed information about the test protocols and requirements..." className="min-h-[100px] rounded-2xl border-slate-200 focus:ring-primary/20 resize-none" />
              </div>

              <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Trash size={18} className="text-primary" />
                    Test Parameters
                  </h3>
                  <Button
                    variant="outline"
                    type="button"
                    size="sm"
                    onClick={() => append({ name: "" })}
                    className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 hover:border-primary font-bold h-9 px-4"
                  >
                    + Add Parameter
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Input
                        {...form.register(`parameters.${index}.name` as const)}
                        placeholder={`Parameter ${index + 1}`}
                        className="h-11 rounded-xl border-slate-200 bg-white"
                      />
                      {fields.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="h-11 w-11 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full h-14 text-lg font-extrabold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 mt-4">
                Verify & Add Test to Menu
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddTest;
