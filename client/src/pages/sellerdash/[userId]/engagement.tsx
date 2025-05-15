import React from "react";
import { useParams } from "wouter";
import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout";

export default function EngagementPage() {
  const { userId } = useParams();
  
  return (
    <SellerDashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Engagement</h1>
      </div>
    </SellerDashboardLayout>
  );
}