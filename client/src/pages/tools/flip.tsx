import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import { 
  Calculator, 
  ArrowLeft, 
  Info, 
  Share2 
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Breadcrumbs from "@/components/common/breadcrumbs";

// Schema for the flip calculator form
const flipCalculatorSchema = z.object({
  purchasePrice: z.string().transform((val) => parseFloat(val.replace(/,/g, ""))),
  repairCosts: z.string().transform((val) => parseFloat(val.replace(/,/g, ""))),
  holdingCosts: z.string().transform((val) => parseFloat(val.replace(/,/g, ""))),
  sellingCosts: z.string().transform((val) => parseFloat(val.replace(/,/g, ""))),
  arv: z.string().transform((val) => parseFloat(val.replace(/,/g, "")))
});

type FlipCalculatorValues = z.infer<typeof flipCalculatorSchema>;

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Format percentage
const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

export default function FlipCalculatorPage() {
  const [results, setResults] = useState<{
    totalCosts: number;
    profitAmount: number;
    roi: number;
  } | null>(null);

  // Form with validation
  const form = useForm<FlipCalculatorValues>({
    resolver: zodResolver(flipCalculatorSchema),
    defaultValues: {
      purchasePrice: "200000",
      repairCosts: "40000",
      holdingCosts: "5000",
      sellingCosts: "15000",
      arv: "300000"
    },
  });

  // Calculate results when form values change
  const calculateResults = (values: FlipCalculatorValues) => {
    const totalCosts = values.purchasePrice + values.repairCosts + values.holdingCosts + values.sellingCosts;
    const profitAmount = values.arv - totalCosts;
    const roi = (profitAmount / totalCosts) * 100;

    setResults({
      totalCosts,
      profitAmount,
      roi
    });
  };

  // Update calculations on form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      try {
        // Only calculate if we have all the values and they're valid numbers
        const formData = form.getValues();
        if (
          !isNaN(formData.purchasePrice) &&
          !isNaN(formData.repairCosts) &&
          !isNaN(formData.holdingCosts) &&
          !isNaN(formData.sellingCosts) &&
          !isNaN(formData.arv)
        ) {
          calculateResults(formData);
        }
      } catch (error) {
        console.error("Error calculating results:", error);
      }
    });
    
    // Run the calculation once on initial render
    calculateResults(form.getValues());

    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Handle form submission
  const onSubmit = (values: FlipCalculatorValues) => {
    calculateResults(values);
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-20">
      {/* Breadcrumbs */}
      <div className="mb-4 flex items-center">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="mr-2 hover:bg-transparent p-0">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tools
          </Button>
        </Link>
        <span className="mx-2">|</span>
        <Breadcrumbs />
      </div>
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#09261E]">
            <Calculator className="inline-block mr-2 mb-1" size={32} strokeWidth={1.5} /> 
            Flip Calculator
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Estimate profit potential for fix-and-flips with detailed cost breakdown and ROI analysis.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" size="sm" className="mr-2">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="purchasePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">$</span>
                            </div>
                            <Input placeholder="200,000" className="pl-7" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="arv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>After Repair Value (ARV)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">$</span>
                            </div>
                            <Input placeholder="300,000" className="pl-7" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="repairCosts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repair Costs</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">$</span>
                            </div>
                            <Input placeholder="40,000" className="pl-7" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="holdingCosts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Holding Costs</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">$</span>
                            </div>
                            <Input placeholder="5,000" className="pl-7" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sellingCosts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Costs</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">$</span>
                            </div>
                            <Input placeholder="15,000" className="pl-7" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="bg-[#09261E] hover:bg-[#135341] text-white w-full md:w-auto">
                  Calculate Flip Potential
                </Button>
              </form>
            </Form>
            
            <div className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="expenses-breakdown">
                  <AccordionTrigger className="text-sm">
                    <span className="flex items-center">
                      <Info className="h-4 w-4 mr-2" /> What to include in each expense category
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p><strong>Purchase Price:</strong> The total cost to acquire the property, including closing costs.</p>
                      <p><strong>Repair Costs:</strong> All renovation expenses including materials, labor, permits, and contingency.</p>
                      <p><strong>Holding Costs:</strong> Property taxes, insurance, utilities, loan interest, and other carrying costs during the renovation period.</p>
                      <p><strong>Selling Costs:</strong> Agent commissions, closing costs, staging, marketing, and any seller concessions.</p>
                      <p><strong>After Repair Value (ARV):</strong> The estimated market value of the property after all renovations are complete.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Card>
        </div>
        
        {/* Results Section */}
        <div>
          <Card className="p-6 bg-[#E9F5F0]">
            <h2 className="text-xl font-semibold mb-4">Profit Analysis</h2>
            
            {results && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Estimated Profit</div>
                  <div className={`text-2xl font-bold ${results.profitAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(results.profitAmount)}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Return on Investment (ROI)</div>
                  <div className={`text-2xl font-bold ${results.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(results.roi)}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-[#09261E]">Cost Breakdown</h3>
                  
                  <div className="flex justify-between text-sm">
                    <span>Purchase Price:</span>
                    <span className="font-medium">{formatCurrency(form.getValues().purchasePrice)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Repair Costs:</span>
                    <span className="font-medium">{formatCurrency(form.getValues().repairCosts)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Holding Costs:</span>
                    <span className="font-medium">{formatCurrency(form.getValues().holdingCosts)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Selling Costs:</span>
                    <span className="font-medium">{formatCurrency(form.getValues().sellingCosts)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="font-medium">Total Investment:</span>
                    <span className="font-medium">{formatCurrency(results.totalCosts)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="font-medium">Sale Price (ARV):</span>
                    <span className="font-medium">{formatCurrency(form.getValues().arv)}</span>
                  </div>
                </div>
                
                <div className="bg-[#09261E] text-white p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">70% Rule Target:</span>
                    <span className="font-bold">
                      {formatCurrency(form.getValues().arv * 0.7 - form.getValues().repairCosts)}
                    </span>
                  </div>
                  <div className="text-xs mt-1 text-gray-300">
                    Maximum purchase price using the 70% rule
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}