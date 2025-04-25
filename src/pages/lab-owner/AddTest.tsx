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
import apiClient from "@/services/api";

const testSchema = z.object({
  name: z.string().min(2, { message: "Test name must be at least 2 characters" }),
  category: z.string().min(2, { message: "Category is required" }),
  sampleType: z.enum(["Blood","Urine","Saliva","Other"], { required_error: "Select sample type" }),
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
  const { id: labId } = useParams<{ id: string }>();

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
    try {
      await apiClient.post(`/labs/${labId}/tests`, data);
      toast.success("Test added successfully");
      navigate(`/lab-owner/lab/${labId}`);
    } catch (error) {
      console.error("Failed to add test:", error);
      toast.error("Failed to add test. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-12">
      <div className="container max-w-xl mx-auto p-4">
        <Button variant="ghost" className="mb-6 flex items-center" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Test</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Test Name</Label>
                    <Input id="name" {...form.register("name")} placeholder="Test Name" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" {...form.register("category")} placeholder="Category" />
                  </div>
                  <div>
                    <Label>Sample Type</Label>
                    <Controller
                      control={form.control}
                      name="sampleType"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sample type" />
                          </SelectTrigger>
                          <SelectContent>
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
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="price">Price (₹)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="inline ml-1 h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>Enter price in INR</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input id="price" {...form.register("price", { valueAsNumber: true })} placeholder="Price (in ₹)" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input id="discount" {...form.register("discount", { valueAsNumber: true })} placeholder="Discount (%)" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="turnaroundTime">Turnaround Time</Label>
                    <Input id="turnaroundTime" {...form.register("turnaroundTime")} placeholder="Turnaround Time (e.g. 12-24 hours)" />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" {...form.register("duration")} placeholder="Duration (e.g. 1 day)" />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register("description")} placeholder="Description" rows={3} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Parameters</h3>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2 mb-2">
                    <Input
                      {...form.register(`parameters.${index}.name` as const)}
                      placeholder={`Parameter ${index + 1}`}
                      className="flex-grow"
                    />
                    {fields.length > 1 && (
                      <Button variant="outline" size="icon" onClick={() => remove(index)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" type="button" onClick={() => append({ name: "" })}>
                  Add Parameter
                </Button>
              </div>
              <Button type="submit" className="mt-6 w-full">Add Test</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddTest;
