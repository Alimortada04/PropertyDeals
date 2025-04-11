import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Info, AlertCircle } from "lucide-react";

// Form schema
const reportFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(100, {
    message: "Title cannot exceed 100 characters.",
  }),
  category: z.string({
    required_error: "Please select an issue category.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(1000, {
    message: "Description cannot exceed 1000 characters.",
  }),
  browser: z.string().optional(),
  device: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

export default function ReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedScreenshot, setUploadedScreenshot] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Initialize form
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      browser: "",
      device: "",
      email: "",
    },
  });

  // Handle screenshot upload (placeholder functionality)
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file to a server
      // Here we just create a local URL for display
      const fileUrl = URL.createObjectURL(file);
      setUploadedScreenshot(fileUrl);
      toast({
        title: "Screenshot uploaded",
        description: `File '${file.name}' has been uploaded.`,
      });
    }
  };

  // Handle form submission
  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Form submitted:", data);
      console.log("Screenshot:", uploadedScreenshot);
      
      // Reset form and show success message
      form.reset();
      setUploadedScreenshot(null);
      
      toast({
        title: "Problem reported successfully!",
        description: "Our team will review your report and respond as soon as possible.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission error",
        description: "There was a problem submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#09261E] mb-2">Report a Problem</h1>
        <p className="text-gray-600 mb-8">
          Let us know about any technical issues or bugs you've encountered while using PropertyDeals.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Before submitting a report</h3>
              <p className="text-amber-700 text-sm">
                Please check our <a href="/help/faq" className="underline">FAQ page</a> to see if your issue has already been addressed. 
                This helps us respond to new issues more quickly.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Briefly describe the issue" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A clear, concise title helps us identify your issue quickly.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="login">Login/Account</SelectItem>
                        <SelectItem value="search">Search Functionality</SelectItem>
                        <SelectItem value="properties">Property Listings</SelectItem>
                        <SelectItem value="payment">Payment Issues</SelectItem>
                        <SelectItem value="ui">UI/Design Issues</SelectItem>
                        <SelectItem value="performance">Performance/Speed</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide step-by-step details of what happened and what you expected to happen" 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include any error messages you saw and steps to reproduce the issue.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="browser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Browser (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Chrome, Firefox, Safari" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="device"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., iPhone, Windows PC, Mac" 
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Your email address" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      We'll use this to follow up with you about the issue.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="block mb-2">Screenshot (Optional)</FormLabel>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {uploadedScreenshot ? (
                    <div className="space-y-4">
                      <img 
                        src={uploadedScreenshot} 
                        alt="Uploaded screenshot" 
                        className="max-h-36 mx-auto object-contain"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setUploadedScreenshot(null)}
                      >
                        Remove Screenshot
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-4">
                        Drag and drop a screenshot here, or click to select a file
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        id="screenshot-upload"
                        className="hidden"
                        onChange={handleScreenshotUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("screenshot-upload")?.click()}
                      >
                        Select File
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 -mx-6 -mb-6 px-6 py-4 border-t rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5" />
                    <p className="text-xs text-gray-500">
                      Your report will be reviewed by our technical team within 24-48 hours.
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-[#09261E] hover:bg-[#135341]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}