import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Info, Trash2, ArrowLeft, FlaskConical, Plus, Loader2, Pencil } from "lucide-react";
import { labOwnerAPI } from "@/services/api";

// ── Validation Schema ─────────────────────────────────────────────────────────
const testSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Test name must be at least 3 characters" })
    .max(150, { message: "Test name must not exceed 150 characters" }),
  category: z
    .string({ required_error: "Please select a category" })
    .min(1, { message: "Category is required" }),
  sampleType: z.enum(
    ["Blood", "Urine", "Saliva", "Stool", "Swab", "Tissue", "Other"],
    { required_error: "Please select a sample type" }
  ),
  price: z
    .number({ required_error: "Price is required", invalid_type_error: "Price must be a number" })
    .positive({ message: "Price must be greater than 0" })
    .max(100000, { message: "Maximum price is 1,00,000" }),
  discount: z
    .number({ invalid_type_error: "Discount must be a number" })
    .min(0)
    .max(90, { message: "Discount cannot exceed 90%" })
    .optional(),
  turnaroundTime: z
    .string()
    .min(1, { message: "Turnaround time is required" })
    .max(50)
    .regex(/^\d+\s*(hour|hours|hr|hrs|day|days|h|d|min|mins|minute|minutes)$/i, {
      message: "Use a number with a unit, e.g. '24 hours', '2 days', '30 mins'",
    }),
  duration: z
    .string()
    .min(1, { message: "Collection duration is required" })
    .max(50)
    .regex(/^\d+\s*(min|mins|minute|minutes|hour|hours|hr|hrs)$/i, {
      message: "Use a number with a unit, e.g. '15 mins', '1 hour'",
    }),
  description: z
    .string()
    .min(15, { message: "Description must be at least 15 characters" })
    .max(800, { message: "Description must not exceed 800 characters" }),
  parameters: z
    .array(z.object({ name: z.string().min(1, { message: "Required" }).max(100) }))
    .min(1, { message: "Add at least one test parameter" })
    .max(30),
});

type TestFormValues = z.infer<typeof testSchema>;

const CATEGORIES = [
  "Hematology", "Biochemistry", "Immunology", "Microbiology", "Pathology",
  "Endocrinology", "Radiology", "Cardiology", "Genetics", "Toxicology", "Other",
];

function deriveDiscount(price: number, discountedPrice: number): number {
  if (!price || !discountedPrice || discountedPrice >= price) return 0;
  return Math.round(((price - discountedPrice) / price) * 100);
}

function normaliseParams(raw: any): { name: string }[] {
  if (!raw || !Array.isArray(raw) || raw.length === 0) return [{ name: "" }];
  if (typeof raw[0] === "string") return raw.map((s: string) => ({ name: s }));
  if (typeof raw[0] === "object" && "name" in raw[0]) return raw;
  return [{ name: "" }];
}

const EditTest = () => {
  const navigate = useNavigate();
  const { labId, labTestId } = useParams<{ labId: string; labTestId: string }>();
  const [loadingTest, setLoadingTest] = useState(true);
  const [testId, setTestId] = useState<string>("");

  const form = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    mode: "onTouched",
    defaultValues: {
      name: "", category: "", sampleType: undefined,
      price: undefined, discount: 0,
      turnaroundTime: "", duration: "", description: "",
      parameters: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "parameters" });
  const price = form.watch("price");
  const discount = form.watch("discount");
  const finalPrice = price && discount ? Math.round(price * (1 - discount / 100)) : price;

  useEffect(() => {
    if (!labId) return;
    const fetchTests = async () => {
      try {
        setLoadingTest(true);
        const { data: tests } = await labOwnerAPI.getLabTests(labId);
        const target = tests?.find((t: any) => (t.labTestId || t.id) === labTestId);
        if (!target) {
          toast.error("Test not found.");
          navigate(`/lab-owner/lab/${labId}`);
          return;
        }
        setTestId(target.id || "");
        const discountPct = deriveDiscount(Number(target.price), Number(target.discountPrice));
        form.reset({
          name: target.name || "",
          category: target.category || "",
          sampleType: (target.sample_type as TestFormValues["sampleType"]) || undefined,
          price: target.price ? Number(target.price) : undefined,
          discount: discountPct,
          turnaroundTime: target.turnaround_time || "",
          duration: target.duration || "",
          description: target.description || "",
          parameters: normaliseParams(target.parameters),
        });
      } catch (err) {
        console.error("Failed to load test:", err);
        toast.error("Could not load test details.");
      } finally {
        setLoadingTest(false);
      }
    };
    fetchTests();
  }, [labId, labTestId]);

  const onSubmit = async (data: TestFormValues) => {
    if (!labTestId || !testId) {
      toast.error("Missing test identifiers. Please go back and try again.");
      return;
    }
    try {
      await labOwnerAPI.updateLabTest(labTestId, testId, data);
      toast.success("Test updated successfully!");
      navigate(`/lab-owner/lab/${labId}`);
    } catch (error) {
      console.error("Failed to update test:", error);
      toast.error("Failed to update test. Please check your details and try again.");
    }
  };

  if (loadingTest) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
          </div>
          <p className="text-slate-500 font-medium">Loading test details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col pt-20 pb-12 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] opacity-60" />
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
          <CardHeader className="bg-gradient-to-r from-amber-500/8 to-transparent border-b border-slate-100 p-8 pt-10">
            <div className="flex items-center gap-4 mb-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                <Pencil size={22} />
              </div>
              <div>
                <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Edit Test Details
                </CardTitle>
                <p className="text-slate-500 font-medium text-sm mt-0.5">
                  Fields marked <span className="text-red-500">*</span> are required.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* ─── Test Information ─── */}
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-slate-700 uppercase tracking-wide border-b pb-2">
                    Test Information
                  </h3>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold">
                          Test Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Complete Blood Count (CBC)"
                            className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold">
                            Category <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-primary/20">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-200">
                                {CATEGORIES.map((cat) => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                      name="sampleType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold">
                            Sample Type <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-primary/20">
                                <SelectValue placeholder="Select sample type" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-200">
                                <SelectItem value="Blood">🩸 Blood</SelectItem>
                                <SelectItem value="Urine">🧪 Urine</SelectItem>
                                <SelectItem value="Saliva">💧 Saliva</SelectItem>
                                <SelectItem value="Stool">🔬 Stool</SelectItem>
                                <SelectItem value="Swab">🩹 Swab</SelectItem>
                                <SelectItem value="Tissue">🧫 Tissue</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                            placeholder="Describe what this test measures, who it's for, and any preparation requirements..."
                            className="min-h-[110px] rounded-2xl border-slate-200 focus:ring-primary/20 resize-none"
                            maxLength={800}
                            {...field}
                          />
                        </FormControl>
                        <div className="flex justify-between items-center">
                          <FormMessage />
                          <span className={`text-xs ml-auto ${field.value?.length > 760 ? "text-red-400" : "text-slate-400"}`}>
                            {field.value?.length || 0}/800
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* ─── Pricing & Timing ─── */}
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-slate-700 uppercase tracking-wide border-b pb-2">
                    Pricing & Timing
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold flex items-center gap-1">
                            Price (₹) <span className="text-red-500">*</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info size={13} className="text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="rounded-lg">Base price in INR (max ₹1,00,000)</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="500"
                              className="h-12 rounded-xl border-slate-200 focus:ring-primary/20 font-bold text-primary"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold flex items-center gap-1">
                            Discount (%)
                            <span className="text-slate-400 font-normal text-xs ml-1">(optional · max 90%)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              min={0}
                              max={90}
                              className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          {finalPrice && discount && discount > 0 && (
                            <FormDescription className="text-green-600 font-semibold">
                              Patient pays: ₹{finalPrice.toLocaleString()}
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="turnaroundTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold flex items-center gap-1">
                            Turnaround Time <span className="text-red-500">*</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info size={13} className="text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="rounded-lg max-w-xs">
                                  Time until report is ready. e.g. "24 hours", "2 days"
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 24 hours"
                              className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold flex items-center gap-1">
                            Collection Duration <span className="text-red-500">*</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info size={13} className="text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="rounded-lg max-w-xs">
                                  How long the collection appointment takes. e.g. "15 mins"
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 15 mins"
                              className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* ─── Parameters ─── */}
                <div className="bg-slate-50/60 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                      Test Parameters <span className="text-red-500">*</span>
                    </h3>
                    <Button
                      variant="outline"
                      type="button"
                      size="sm"
                      onClick={() => append({ name: "" })}
                      disabled={fields.length >= 30}
                      className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 hover:border-primary font-bold h-9 px-4"
                    >
                      <Plus size={14} className="mr-1" /> Add Parameter
                    </Button>
                  </div>

                  <p className="text-xs text-slate-500">
                    The specific biomarkers or values this test measures (e.g. Hemoglobin, WBC Count).
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {fields.map((field, index) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={`parameters.${index}.name`}
                        render={({ field: f }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Input
                                  {...f}
                                  placeholder={`Parameter ${index + 1} (e.g. Hemoglobin)`}
                                  className="h-11 rounded-xl border-slate-200 bg-white"
                                />
                                {fields.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="h-11 w-11 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {form.formState.errors.parameters?.root && (
                    <p className="text-sm text-red-500">{form.formState.errors.parameters.root.message}</p>
                  )}
                  {typeof form.formState.errors.parameters?.message === "string" && (
                    <p className="text-sm text-red-500">{form.formState.errors.parameters.message}</p>
                  )}

                  <p className="text-[10px] text-slate-400">{fields.length}/30 parameters added</p>
                </div>

                {/* ─── Submit ─── */}
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-14 text-lg font-extrabold rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 mt-4 text-white"
                >
                  {form.formState.isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={20} /> Saving changes…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FlaskConical size={20} /> Save Changes
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditTest;
