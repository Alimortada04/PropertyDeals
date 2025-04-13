import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, DollarSign, Percent, Home } from 'lucide-react';
import { ExtendedProperty } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';

interface PropertyCalculatorProps {
  property: ExtendedProperty;
  scrollY: number;
  isVisible: boolean;
}

export default function PropertyCalculator({ property, scrollY, isVisible }: PropertyCalculatorProps) {
  const [calculatorMode, setCalculatorMode] = useState<'flip' | 'rental'>('flip');
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);
  
  // Simulate loading time when property changes
  useEffect(() => {
    setIsCalculatorVisible(false);
    const timer = setTimeout(() => {
      setIsCalculatorVisible(true);
    }, 300); // Short delay after property changes
    
    return () => clearTimeout(timer);
  }, [property.id]);
  
  // Calculate placeholder values based on property price
  const price = property.price || 250000;
  const rehabCost = Math.round(price * 0.15); // 15% of purchase price
  const arv = Math.round(price * 1.4); // 40% increase after renovation
  const estimatedProfit = arv - price - rehabCost;
  
  // Rental calculation placeholders
  const monthlyRent = Math.round(price * 0.008); // 0.8% of price monthly
  const expenses = Math.round(monthlyRent * 0.4); // 40% for expenses
  const cashFlow = monthlyRent - expenses;
  const capRate = ((cashFlow * 12) / price) * 100;
  
  return (
    <div
      className={cn(
        "absolute top-[10%] right-[-5%] w-[70%] bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-5 overflow-hidden transform will-change-transform transition-all duration-500",
        {
          'opacity-0 translate-x-10': !isVisible || !isCalculatorVisible,
          'opacity-100 translate-x-0': isVisible && isCalculatorVisible
        }
      )}
      style={{
        transform: `translate3d(${isVisible && isCalculatorVisible ? 0 : 10}px, ${scrollY * 0.01}px, 0) rotate(3deg)`,
        transformStyle: 'preserve-3d',
        boxShadow: '0 15px 30px -10px rgba(9, 38, 30, 0.15)'
      }}
    >
      {/* Calculator Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-heading text-lg font-bold text-[#09261E] flex items-center gap-2">
          <Calculator className="h-5 w-5 text-[#135341]" />
          <span>Investment Calculator</span>
        </h3>
        
        {/* Mode toggle */}
        <div className="flex rounded-full overflow-hidden border border-gray-200 text-xs">
          <button
            className={cn("px-3 py-1 transition-colors", {
              "bg-[#135341] text-white": calculatorMode === "flip",
              "bg-gray-100 text-gray-700": calculatorMode !== "flip"
            })}
            onClick={() => setCalculatorMode('flip')}
          >
            Flip
          </button>
          <button
            className={cn("px-3 py-1 transition-colors", {
              "bg-[#135341] text-white": calculatorMode === "rental",
              "bg-gray-100 text-gray-700": calculatorMode !== "rental"
            })}
            onClick={() => setCalculatorMode('rental')}
          >
            Rental
          </button>
        </div>
      </div>
      
      {/* Property name */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Home className="h-3 w-3" /> {property.title}
        </p>
      </div>
      
      {/* Calculator Content */}
      <div className="space-y-3 mb-5">
        {calculatorMode === 'flip' ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Purchase Price</p>
                <p className="font-bold text-[#09261E] flex items-center">
                  <DollarSign className="h-3 w-3 inline mr-1" />
                  {price.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Rehab Cost</p>
                <p className="font-bold text-[#09261E] flex items-center">
                  <DollarSign className="h-3 w-3 inline mr-1" />
                  {rehabCost.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">After Repair Value</p>
                <p className="font-bold text-[#09261E] flex items-center">
                  <DollarSign className="h-3 w-3 inline mr-1" />
                  {arv.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-[#135341]/10 p-3">
                <p className="text-xs text-gray-500">Est. Profit</p>
                <p className="font-bold text-[#135341] flex items-center">
                  <DollarSign className="h-3 w-3 inline mr-1" />
                  {estimatedProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Monthly Rent</p>
                <p className="font-bold text-[#09261E] flex items-center">
                  <DollarSign className="h-3 w-3 inline mr-1" />
                  {monthlyRent.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Expenses</p>
                <p className="font-bold text-[#09261E] flex items-center">
                  <DollarSign className="h-3 w-3 inline mr-1" />
                  {expenses.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-[#135341]/10 p-3">
                <p className="text-xs text-gray-500">Cash Flow</p>
                <p className="font-bold text-[#135341] flex items-center">
                  <DollarSign className="h-3 w-3 inline mr-1" />
                  {cashFlow.toLocaleString()}/mo
                </p>
              </div>
              <div className="rounded-lg bg-[#135341]/10 p-3">
                <p className="text-xs text-gray-500">Cap Rate</p>
                <p className="font-bold text-[#135341] flex items-center">
                  <Percent className="h-3 w-3 inline mr-1" />
                  {capRate.toFixed(2)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* CTA Button */}
      <Link href="/calculators">
        <Button 
          className="w-full bg-[#09261E] hover:bg-[#135341] text-white text-sm rounded-lg py-2 px-4 transition-colors group"
          variant="default"
          size="sm"
        >
          Run Full Analysis
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </Link>
      
      {/* Curved decorative element */}
      <div 
        className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-[#E59F9F]/10 opacity-50"
        style={{
          filter: 'blur(15px)',
        }}
      ></div>
      <div 
        className="absolute -top-10 -left-10 w-16 h-16 rounded-full bg-[#135341]/10 opacity-50"
        style={{
          filter: 'blur(15px)',
        }}
      ></div>
    </div>
  );
}