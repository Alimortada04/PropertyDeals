import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SellerDashboardLayout from '@/components/layout/seller-dashboard-layout';
import { EnhancedPropertyListingModal } from '@/components/property/enhanced-property-listing-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Save, Eye, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PropertyEditorPageProps {}

export default function PropertyEditorPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const userId = params.userId || '';
  const propertyId = params.propertyId || '';
  
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Fetch the property data
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property-profile', propertyId],
    queryFn: async () => {
      const response = await fetch(`/api/property-profiles/${propertyId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }
      
      return response.json();
    },
    enabled: !!propertyId,
  });

  // Publish property mutation
  const publishMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/property-profiles/${propertyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'live',
          isPublic: true,
          publishedAt: new Date().toISOString(),
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to publish property');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Property Published",
        description: "Your property is now live and visible to buyers.",
      });
      queryClient.invalidateQueries({ queryKey: ['property-profile', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['property-profiles'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to publish property. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBack = () => {
    setLocation(`/sellerdash/${userId}`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    handleBack();
  };

  const handleDraftCreated = (newPropertyId: string) => {
    // This shouldn't happen as we're already editing an existing property
    console.log('Draft created:', newPropertyId);
  };

  const handlePublish = () => {
    publishMutation.mutate();
  };

  if (isLoading) {
    return (
      <SellerDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#135341]" />
            <p className="text-gray-600">Loading property...</p>
          </div>
        </div>
      </SellerDashboardLayout>
    );
  }

  if (error) {
    return (
      <SellerDashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                We couldn't load this property. It may not exist or you may not have permission to edit it.
              </p>
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </SellerDashboardLayout>
    );
  }

  const isDraft = property?.status === 'draft';
  const isLive = property?.status === 'live';

  return (
    <SellerDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="group hover:text-[#135341] transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {property?.name || 'Unnamed Property'}
              </h1>
              <p className="text-gray-600">
                {isDraft ? 'Complete your property listing' : 'Edit your property listing'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isDraft && (
              <Button 
                onClick={handlePublish}
                disabled={publishMutation.isPending}
                className="bg-[#135341] hover:bg-[#09261E] text-white"
              >
                {publishMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Publish Property
                  </>
                )}
              </Button>
            )}
            
            {isLive && (
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Live
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Property Status */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isDraft 
              ? 'bg-yellow-100 text-yellow-800' 
              : isLive 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isDraft && 'Draft'}
            {isLive && 'Live'}
            {!isDraft && !isLive && property?.status}
          </div>
        </div>

        {/* Property Editor Modal */}
        <EnhancedPropertyListingModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onDraftCreated={handleDraftCreated}
          propertyId={propertyId}
          existingProperty={property}
        />

        {/* Fallback content when modal is closed */}
        {!isModalOpen && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">Property editor closed.</p>
              <Button onClick={() => setIsModalOpen(true)}>
                Reopen Editor
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </SellerDashboardLayout>
  );
}