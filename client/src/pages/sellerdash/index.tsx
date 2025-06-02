import React, { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useSellerProfile } from "@/hooks/useSellerProfile";
import { useBuyerProfile } from "@/hooks/useBuyerProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Eye, Share, BarChart3, MapPin, DollarSign, Home, AlertCircle, Clock, XCircle, Pause } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function SellerDashboard() {
  const { user, supabaseUser } = useAuth();
  const { profile: sellerProfile, loading: sellerLoading } = useSellerProfile();
  const { profile } = useBuyerProfile();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch properties from Supabase
  const fetchProperties = async () => {
    console.log('Auth state - user:', user);
    console.log('Auth state - supabaseUser:', supabaseUser);
    
    // Use supabaseUser.id directly for UUID compatibility
    const userId = supabaseUser?.id;
    console.log('Using userId for query:', userId);
    
    if (!userId) {
      console.log('No user ID available, skipping fetch');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching properties for user:', userId);
      const { data, error } = await supabase
        .from('property_profile')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching property profiles:', error);
        setError(error.message);
        return;
      }

      console.log('Properties fetched:', data);
      setProperties(data || []);
      setError(null);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  // Refetch function for external use
  const refetch = () => {
    fetchProperties();
  };

  // Fetch properties on component mount and user change
  useEffect(() => {
    fetchProperties();
  }, [supabaseUser?.id]);

  // Group properties by status
  const draftProperties = properties.filter((p: any) => p.status === 'draft');
  const activeProperties = properties.filter((p: any) => p.status === 'active' || p.status === 'live');
  const pendingProperties = properties.filter((p: any) => p.status === 'pending' || p.status === 'under_contract');
  const closedProperties = properties.filter((p: any) => p.status === 'closed');

  const formatPrice = (price: string | number | null) => {
    if (!price) return 'Price TBD';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'Price TBD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const getDaysUntilClosing = (closingDate: string | null) => {
    if (!closingDate) return null;
    const closing = new Date(closingDate);
    const today = new Date();
    const diffTime = closing.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'outline';
      case 'active':
      case 'live': return 'default';
      case 'pending':
      case 'under_contract': return 'secondary';
      case 'closed': return 'destructive';
      default: return 'outline';
    }
  };

  // PropertyCard component
  const PropertyCard = ({ property, isDraft = false }: { property: any, isDraft?: boolean }) => {
    const daysUntilClosing = getDaysUntilClosing(property.closing_date);
    const address = `${property.address || 'No Address'}, ${property.city || ''}, ${property.state || ''}`.replace(', ,', ',').replace(/,$/, '');
    
    return (
      <Card className="group hover:shadow-lg transition-all duration-200">
        <div className="relative">
          {/* Status Badge */}
          <Badge 
            className="absolute top-3 left-3 z-10" 
            variant={getStatusBadgeVariant(property.status)}
          >
            {property.status?.charAt(0).toUpperCase() + property.status?.slice(1) || 'Draft'}
          </Badge>
          
          {/* Property Image */}
          <div className="aspect-video w-full bg-gray-200 rounded-t-lg overflow-hidden">
            {property.primary_image ? (
              <img 
                src={property.primary_image} 
                alt={property.name || address}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Home className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {property.name || address}
          </h3>

          {/* Address */}
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{address}</span>
          </div>

          {/* Price Information */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Listing Price</span>
              <span className="font-semibold">{formatPrice(property.listing_price)}</span>
            </div>
            {property.assignment_fee && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Assignment Fee</span>
                <span className="font-semibold text-green-600">{formatPrice(property.assignment_fee)}</span>
              </div>
            )}
          </div>

          {/* Engagement Data */}
          <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{property.view_count || 0} views</span>
            </div>
            {daysUntilClosing && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{daysUntilClosing} days left</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link href={`/sellerdash/property/${property.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="h-4 w-4 mr-1" />
                {isDraft ? 'Complete' : 'Edit'}
              </Button>
            </Link>
            {!isDraft && (
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Determine seller access status
  const getSellerAccessStatus = () => {
    if (sellerLoading) return 'loading';
    if (!sellerProfile) return 'no_profile';
    return sellerProfile.status;
  };

  const renderStatusModal = () => {
    const status = getSellerAccessStatus();

    const statusConfig = {
      no_profile: {
        icon: <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />,
        title: "Seller Application Required",
        message: "To access the seller dashboard and list properties, you need to complete the seller application process.",
        action: "Apply as Seller",
        actionVariant: "default" as const
      },
      pending: {
        icon: <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />,
        title: "Application Pending",
        message: "Your seller application is under review. We'll notify you once it's approved.",
        action: "Contact Support",
        actionVariant: "outline" as const
      },
      rejected: {
        icon: <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />,
        title: "Application Rejected",
        message: "Your seller application was not approved. You can reapply or contact support for more information.",
        action: "Reapply",
        actionVariant: "default" as const
      },
      paused: {
        icon: <Pause className="h-12 w-12 text-blue-500 mx-auto mb-4" />,
        title: "Account Paused",
        message: "Your seller account has been temporarily paused. Contact support to reactivate.",
        action: "Contact Support",
        actionVariant: "outline" as const
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {config.icon}
              {config.title}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-gray-600">{config.message}</p>
            <Button variant={config.actionVariant} className="w-full">
              {config.action}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Show loading state
  if (sellerLoading || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Check seller access
  const sellerStatus = getSellerAccessStatus();
  const hasSellerAccess = sellerStatus === 'active';

  // Show status modal for non-active sellers
  if (!hasSellerAccess) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <AlertCircle className="h-16 w-16 mx-auto text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Seller Access Required</h3>
            <p className="text-gray-600 mb-6">
              Complete your seller application to access the property management dashboard.
            </p>
            <Button onClick={() => setShowStatusModal(true)}>
              View Application Status
            </Button>
          </div>
        </div>
        {renderStatusModal()}
      </div>
    );
  }

  const PropertyCard = ({ property, isDraft = false }: { property: any; isDraft?: boolean }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {property.title || property.name || property.address || 'Untitled Property'}
            </CardTitle>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {property.address || 'Address not provided'}
            </p>
          </div>
          <Badge variant={isDraft ? "secondary" : "default"}>
            {property.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Price:</span>
            <span className="font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {formatPrice(property.listing_price)}
            </span>
          </div>
          
          {property.property_type && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Type:</span>
              <span className="font-medium flex items-center">
                <Home className="h-4 w-4 mr-1" />
                {property.property_type}
              </span>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {isDraft ? (
              <Link href={`/sellerdash/${profile?.id}/property/${property.id}`}>
                <Button size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Continue Listing
                </Button>
              </Link>
            ) : (
              <>
                <Link href={`/sellerdash/${profile?.id}/property/${property.id}`}>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/properties/${property.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Button size="sm" variant="outline">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading properties: {error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Properties</h1>
          <p className="text-gray-600 mt-2">
            Manage your property listings and track their performance
          </p>
        </div>
        <Link href="/sellerdash">
          <Button onClick={() => {
            // Trigger the property listing modal
            const modal = document.querySelector('[data-property-modal-trigger]') as HTMLElement;
            if (modal) modal.click();
          }}>
            <Plus className="h-4 w-4 mr-2" />
            List a Property
          </Button>
        </Link>
      </div>

      {/* Draft Properties */}
      {draftProperties.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            Draft Listings ({draftProperties.length})
            <Badge variant="secondary" className="ml-2">
              Incomplete
            </Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {draftProperties.map(property => (
              <PropertyCard key={property.id} property={property} isDraft={true} />
            ))}
          </div>
        </section>
      )}

      {/* Active Properties */}
      {activeProperties.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            Active Listings ({activeProperties.length})
            <Badge variant="default" className="ml-2">
              Live
            </Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      )}

      {/* Pending Properties */}
      {pendingProperties.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            Pending ({pendingProperties.length})
            <Badge variant="outline" className="ml-2">
              Under Review
            </Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      )}

      {/* Closed Properties */}
      {closedProperties.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            Closed ({closedProperties.length})
            <Badge variant="secondary" className="ml-2">
              Sold
            </Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {closedProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {properties.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Home className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Properties Yet</h3>
            <p className="text-gray-600 mb-6">
              Start building your portfolio by listing your first property
            </p>
            <Link href="/properties">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                List Your First Property
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}