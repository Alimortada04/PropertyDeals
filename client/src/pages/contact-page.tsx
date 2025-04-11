import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Breadcrumbs from "@/components/common/breadcrumbs";

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Contact form data:", data);
      
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
      });
      
      setIsSubmitting(false);
      setSubmitted(true);
      form.reset();
    }, 1500);
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>
      
      {/* Header */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#09261E] mb-6">Contact Us</h1>
            <p className="text-xl text-gray-600">
              Have questions about PropertyDeals? We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-6">Get in Touch</h2>
              
              {submitted ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-heading font-bold text-[#09261E] mb-2">Message Sent!</h3>
                      <p className="text-gray-600 mb-6">Thank you for contacting us. We'll get back to you shortly.</p>
                      <Button 
                        onClick={() => setSubmitted(false)}
                        className="bg-[#09261E] hover:bg-[#135341] text-white"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="What's this about?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help you?" 
                              rows={6}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="bg-[#09261E] hover:bg-[#135341] text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-6">Contact Information</h2>
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="mb-8">
                  <h3 className="font-heading font-bold text-[#135341] mb-2">Office Location</h3>
                  <p className="text-gray-700">123 Property Lane</p>
                  <p className="text-gray-700">Milwaukee, WI 53202</p>
                </div>
                <div className="mb-8">
                  <h3 className="font-heading font-bold text-[#135341] mb-2">Contact Details</h3>
                  <p className="text-gray-700 mb-1">
                    <i className="fas fa-phone-alt mr-2 text-[#09261E]"></i> (414) 555-1234
                  </p>
                  <p className="text-gray-700 mb-1">
                    <i className="fas fa-envelope mr-2 text-[#09261E]"></i> info@propertydeals.com
                  </p>
                </div>
                <div className="mb-8">
                  <h3 className="font-heading font-bold text-[#135341] mb-2">Business Hours</h3>
                  <p className="text-gray-700 mb-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-700 mb-1">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-gray-700">Sunday: Closed</p>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#135341] mb-2">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-[#09261E] hover:text-[#135341] transition-colors">
                      <i className="fab fa-facebook-f text-xl"></i>
                    </a>
                    <a href="#" className="text-[#09261E] hover:text-[#135341] transition-colors">
                      <i className="fab fa-twitter text-xl"></i>
                    </a>
                    <a href="#" className="text-[#09261E] hover:text-[#135341] transition-colors">
                      <i className="fab fa-instagram text-xl"></i>
                    </a>
                    <a href="#" className="text-[#09261E] hover:text-[#135341] transition-colors">
                      <i className="fab fa-linkedin-in text-xl"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 mb-8">
        <div className="container mx-auto px-4">
          <div className="rounded-lg overflow-hidden h-96 shadow-lg">
            <div className="h-full w-full bg-[#09261E]/5 flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-map-marker-alt text-[#09261E] text-5xl mb-4"></i>
                <h3 className="text-xl font-heading font-bold text-[#09261E] mb-2">Find Us on the Map</h3>
                <p className="text-gray-600 mb-4">123 Property Lane, Milwaukee, WI 53202</p>
                <Button className="bg-[#09261E] hover:bg-[#135341] text-white">
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-10 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-heading font-bold text-[#09261E] mb-2">How does PropertyDeals work?</h3>
                <p className="text-gray-700">
                  PropertyDeals connects buyers directly with sellers of off-market properties, streamlining the process and removing unnecessary intermediaries. Browse available properties, contact sellers, and manage your transactions all in one platform.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-heading font-bold text-[#09261E] mb-2">How do I list my property on PropertyDeals?</h3>
                <p className="text-gray-700">
                  Create a seller account, navigate to your dashboard, and click "Add New Property." Fill in your property details, upload photos, set your price, and publish your listing to make it visible to potential buyers.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-heading font-bold text-[#09261E] mb-2">Are there fees for using PropertyDeals?</h3>
                <p className="text-gray-700">
                  Basic accounts are free. Sellers pay a small listing fee for each property, significantly lower than traditional real estate commissions. We never charge buyers any fees to use our platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
