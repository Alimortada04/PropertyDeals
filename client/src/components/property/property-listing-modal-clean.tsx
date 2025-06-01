import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { usePropertyProfile } from "@/hooks/usePropertyProfile";
import { toast } from "@/hooks/use-toast";

// Simplified form schema for core fields
const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  propertyType: z.string().min(1, "Property type is required"),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  sqft: z.string().optional(),
  purchasePrice: z.string().optional(),
  listingPrice: z.string().optional(),
  description: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

interface PropertyListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDraftCreated?: (propertyId: string) => void;
}

export function PropertyListingModal({ isOpen, onClose, onDraftCreated }: PropertyListingModalProps) {
  const { supabaseUser } = useAuth();
  const { createPropertyDraft } = usePropertyProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      propertyType: "residential",
      bedrooms: "",
      bathrooms: "",
      sqft: "",
      purchasePrice: "",
      listingPrice: "",
      description: "",
    },
  });

  const onSubmit = async (data: PropertyFormValues) => {
    if (!supabaseUser?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a property listing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Use the createPropertyDraft function which properly handles UUID authentication
      const result = await createPropertyDraft({
        // Core required fields
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        
        // Property details
        propertyType: data.propertyType,
        bedrooms: data.bedrooms || null,
        bathrooms: data.bathrooms || null,
        sqft: data.sqft || null,
        
        // Pricing
        purchasePrice: data.purchasePrice || null,
        listingPrice: data.listingPrice || null,
        
        // Description
        description: data.description || "",
        
        // Default values
        status: "draft",
        featuredProperty: false,
        tags: [],
      });

      if (result) {
        toast({
          title: "Draft Created!",
          description: "Your property draft has been saved.",
        });

        if (onDraftCreated) {
          onDraftCreated(result.id.toString());
        }

        // Reset form and close modal
        form.reset();
        onClose();
      }
    } catch (error) {
      console.error("Error creating property:", error);
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Property Listing</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter property name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ZIP code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <FormControl>
                      <Input placeholder="residential" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter number of bedrooms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter number of bathrooms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sqft"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Square Feet</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter square footage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter purchase price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="listingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter listing price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter property description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Draft"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}