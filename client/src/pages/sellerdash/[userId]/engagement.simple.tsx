import React from "react";
import { useParams } from "wouter";
import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function EngagementPageSimple() {
  const { userId } = useParams();
  
  return (
    <SellerDashboardLayout>
      <div className="py-6">
        <div className="flex flex-col space-y-6">
          {/* Page header with title */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Engagements</h1>
          </div>
          
          {/* Simple content for debugging */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Dashboard</CardTitle>
              <CardDescription>We're working on this page</CardDescription>
            </CardHeader>
            <CardContent>
              <p>The marketing page is working correctly, but we're having some issues with this page.</p>
              <p className="mt-4">Please check back soon for the full engagement experience!</p>
              <p className="mt-4">Seller ID: {userId}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SellerDashboardLayout>
  );
}