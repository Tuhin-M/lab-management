
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const formSchema = z.object({
  recordType: z.enum(['prescription', 'test_result', 'health_metric', 'doctor_note']),
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  date: z.date(),
  doctorName: z.string().optional(),
  hospitalName: z.string().optional(),
  description: z.string().optional(),
  // Tags and file handling will be managed separately
});

type FormValues = z.infer<typeof formSchema>;

interface AddHealthRecordFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AddHealthRecordForm: React.FC<AddHealthRecordFormProps> = ({ onSubmit, onCancel }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recordType: 'prescription',
      title: '',
      date: new Date(),
      doctorName: '',
      hospitalName: '',
      description: '',
    },
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleFormSubmit = (data: FormValues) => {
    // Combine form data with tags and file
    const formData = new FormData();
    
    // Add the form data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'date') {
          formData.append(key, (value as Date).toISOString());
        } else {
          formData.append(key, value as string);
        }
      }
    });
    
    // Add tags as a JSON string
    if (tags.length > 0) {
      formData.append('tags', JSON.stringify(tags));
    }
    
    // Add the file if present
    if (file) {
      formData.append('file', file);
    }
    
    onSubmit(formData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add Health Record</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="recordType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select record type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="test_result">Test Result</SelectItem>
                      <SelectItem value="health_metric">Health Metric</SelectItem>
                      <SelectItem value="doctor_note">Doctor Note</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for the record" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="doctorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doctor name (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hospitalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital/Clinic</FormLabel>
                    <FormControl>
                      <Input placeholder="Hospital or clinic name (optional)" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a description or notes (optional)" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel className="block mb-2">Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-5 w-5 p-0 ml-1"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags..."
                  className="mr-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddTag}
                >
                  Add
                </Button>
              </div>
            </div>
            
            <div>
              <FormLabel className="block mb-2">Upload File</FormLabel>
              <Input
                type="file"
                onChange={handleFileChange}
                className="mb-2"
              />
              {filePreview && (
                <div className="mt-2 relative w-32 h-32 border rounded overflow-hidden">
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => {
                      setFile(null);
                      setFilePreview(null);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                Save Record
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddHealthRecordForm;
