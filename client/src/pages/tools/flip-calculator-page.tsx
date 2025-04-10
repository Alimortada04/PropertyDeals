import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Calculator, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const formSchema = z.object({
  purchasePrice: z.coerce.number().positive("Purchase price must be positive"),
  repairCosts: z.coerce.number().min(0, "Repair costs cannot be negative"),
  holdingCosts: z.coerce.number().min(0, "Holding costs cannot be negative"),
  sellingCosts: z.coerce.number().min(0, "Selling costs cannot be negative"),
  afterRepairValue: z.coerce.number().positive("ARV must be positive")
});

type FormValues = z.infer<typeof formSchema>;

export default function FlipCalculatorPage() {
  const [results, setResults] = useState<{
    profit: number;
    roi: number;
    totalCosts: number;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchasePrice: 100000,
      repairCosts: 20000,
      holdingCosts: 5000,
      sellingCosts: 10000,
      afterRepairValue: 180000
    }
  });

  function onSubmit(data: FormValues) {
    // Calculate profit
    const totalCosts = data.purchasePrice + data.repairCosts + data.holdingCosts + data.sellingCosts;
    const profit = data.afterRepairValue - totalCosts;
    const roi = (profit / totalCosts) * 100;

    setResults({
      profit,
      roi,
      totalCosts
    });
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/tools" className="inline-flex items-center text-[#135341] hover:text-[#09261E]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tools
        </Link>
      </div>
      
      <div className="flex items-center justify-center mb-8">
        <div className="p-3 rounded-full bg-[#09261E]/10 text-[#09261E] mr-4">
          <Calculator size={32} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#09261E]">
          Flip Calculator
        </h1>
      </div>
      
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Estimate your potential profit from house flipping by entering your costs and after repair value.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Input Deal Details</CardTitle>
            <CardDescription>
              Enter the financial details of your potential flip
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="purchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="repairCosts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repair Costs ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
                      <FormLabel>Holding Costs ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Includes insurance, utilities, loan interest, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sellingCosts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Costs ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Includes agent commissions, closing costs, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="afterRepairValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>After Repair Value (ARV) ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#09261E] hover:bg-[#135341] text-white"
                >
                  Calculate Profit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              Your potential flip profitability analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {results ? (
              <>
                <div className="text-center py-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Estimated Profit</h3>
                  <div className={`text-4xl font-bold mb-1 ${results.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${results.profit.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">
                    Return on Investment: {results.roi.toFixed(2)}%
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Deal Summary</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span>Purchase Price:</span>
                        <span className="font-medium">${form.getValues().purchasePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Repair Costs:</span>
                        <span className="font-medium">${form.getValues().repairCosts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Holding Costs:</span>
                        <span className="font-medium">${form.getValues().holdingCosts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Selling Costs:</span>
                        <span className="font-medium">${form.getValues().sellingCosts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span>Total Costs:</span>
                        <span className="font-medium">${results.totalCosts.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Sale Analysis</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span>After Repair Value:</span>
                        <span className="font-medium">${form.getValues().afterRepairValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Total Investment:</span>
                        <span className="font-medium">${results.totalCosts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                        <span>Net Profit:</span>
                        <span className={results.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                          ${results.profit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center text-gray-500">
                <Calculator className="h-16 w-16 mb-4 text-gray-300" />
                <h3 className="text-xl font-medium mb-2">No Calculation Yet</h3>
                <p>Enter your deal details and calculate to see projected profits.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}