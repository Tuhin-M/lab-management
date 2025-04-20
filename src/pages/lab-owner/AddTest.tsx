import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testSchema = z.object({
  name: z.string().min(2, { message: "Test name must be at least 2 characters" }),
  price: z.number().min(1, { message: "Price must be a positive number" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" })
});

type TestFormValues = z.infer<typeof testSchema>;

const AddTest = () => {
  const navigate = useNavigate();
  const { id: labId } = useParams<{ id: string }>();

  const form = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: "",
      price: 0,
      duration: "",
      description: ""
    }
  });

  const onSubmit = async (data: TestFormValues) => {
    try {
      const res = await fetch(`/api/labs/${labId}/tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to add test");
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
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Test</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <Input {...form.register("name")} placeholder="Test Name" label="Test Name" />
                <Input {...form.register("price", { valueAsNumber: true })} placeholder="Price (in ₹)" type="number" label="Price" />
                <Input {...form.register("duration")} placeholder="Duration (e.g. 1 day)" label="Duration" />
                <Textarea {...form.register("description")} placeholder="Description" rows={3} />
              </div>
              <Button type="submit" className="w-full">Add Test</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddTest;
