import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ArrowLeft, 
  Eye, 
  Save, 
  MapPin, 
  Home, 
  DollarSign, 
  FileText, 
  Image as ImageIcon, 
  Building, 
  Upload, 
  X,
  Plus,
  Trash2,
  ExternalLink,
  Video,
  Key,
  Calendar,
  Tag,
  Calculator,
  Handshake,
  Settings
} from 'lucide-react';
import { SellerDashboardLayout } from '@/components/layout/seller-dashboard-layout';
import { apiRequest } from '@/lib/queryClient';

interface PropertyEditorData {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  county?: string;
  parcelId?: string;
  status: 'live' | 'draft';
  isPublic: boolean;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize?: string;
  yearBuilt?: number;
  condition: string;
  occupancyStatus: string;
  price: number;
  purchasePrice?: number;
  listingPrice: number;
  assignmentFee?: number;
  arv?: number;
  estimatedRepairs?: number;
  monthlyRent?: number;
  totalMonthlyRent?: number;
  jvAvailable?: boolean;
  propertyTaxes?: number;
  insurance?: number;
  utilities?: number;
  hoaFees?: number;
  shortSummary: string;
  description: string;
  primaryImage?: string;
  images: string[];
  videoUrl?: string;
  accessType?: string;
  closingDate?: string;
  units?: Array<{
    id: string;
    label: string;
    beds: number;
    baths: number;
    rent: number;
    sqft: number;
    occupied: boolean;
  }>;
  expenses?: Array<{
    id: string;
    name: string;
    amount: string;
    frequency: 'monthly' | 'quarterly' | 'annually';
  }>;
  repairs?: Array<{
    id: string;
    taskName: string;
    description: string;
    estimatedCost: number;
    contractorQuote?: string;
    contractor?: string;
  }>;
  documents?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  partners?: string[];
  additionalNotes?: string;
  strategyTags: string[];
  conditionTags: string[];
  saleType: string;
  lockboxCode?: string;
  accessInstructions?: string;
  tenantAware: boolean;
  showingNotes?: string;
}

export default function PropertyEditor() {
  const { userId, propertyId } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load property data
  const { data: property, isLoading } = useQuery({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId
  });

  // Local state for editing
  const [editData, setEditData] = useState<PropertyEditorData | null>(null);
  const [activeSection, setActiveSection] = useState('info');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize edit data when property loads
  useEffect(() => {
    if (property && !editData) {
      setEditData({
        id: property.id,
        title: property.title || '',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zipCode: property.zipCode || '',
        status: property.status || 'draft',
        isPublic: property.isPublic ?? true,
        propertyType: property.propertyType || 'Single Family',
        bedrooms: property.bedrooms || 3,
        bathrooms: property.bathrooms || 2,
        squareFeet: property.squareFeet || 0,
        lotSize: property.lotSize,
        yearBuilt: property.yearBuilt,
        condition: property.condition || 'Good',
        occupancyStatus: property.occupancyStatus || 'Vacant',
        price: property.price || 0,
        arv: property.arv,
        estimatedRepairs: property.estimatedRepairs,
        monthlyRent: property.monthlyRent,
        assignmentFee: property.assignmentFee,
        jvAvailable: property.jvAvailable ?? false,
        propertyTaxes: property.propertyTaxes,
        insurance: property.insurance,
        utilities: property.utilities,
        hoaFees: property.hoaFees,
        shortSummary: property.shortSummary || '',
        description: property.description || '',
        images: property.images || [],
        videoUrl: property.videoUrl,
        units: property.units || [],
        documents: property.documents || [],
        strategyTags: property.strategyTags || [],
        conditionTags: property.conditionTags || [],
        saleType: property.saleType || 'Direct Sale',
        lockboxCode: property.lockboxCode,
        accessInstructions: property.accessInstructions,
        tenantAware: property.tenantAware ?? false,
        showingNotes: property.showingNotes
      });
    }
  }, [property, editData]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<PropertyEditorData>) => {
      const res = await apiRequest('PATCH', `/api/properties/${propertyId}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Property Updated',
        description: 'Your changes have been saved successfully.',
      });
      setHasUnsavedChanges(false);
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}`] });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: error.message || 'Failed to save changes.',
      });
    }
  });

  const handleFieldChange = (field: string, value: any) => {
    if (!editData) return;
    
    setEditData(prev => prev ? { ...prev, [field]: value } : null);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (!editData) return;
    saveMutation.mutate(editData);
  };

  const handlePreview = () => {
    window.open(`/p/${propertyId}`, '_blank');
  };

  if (isLoading) {
    return (
      <SellerDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#135341] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property...</p>
          </div>
        </div>
      </SellerDashboardLayout>
    );
  }

  if (!property || !editData) {
    return (
      <SellerDashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => setLocation(`/sellerdash/${userId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </SellerDashboardLayout>
    );
  }

  const sections = [
    { id: 'info', label: 'Property Information', icon: Home },
    { id: 'media', label: 'Property Media', icon: ImageIcon },
    { id: 'financials', label: 'Property Financials', icon: DollarSign },
    { id: 'logistics', label: 'Listing Logistics', icon: MapPin },
    { id: 'review', label: 'Review', icon: FileText }
  ];

  return (
    <SellerDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          {/* Top row - Back button and action buttons */}
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setLocation(`/sellerdash/${userId}`)}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handlePreview}
                className="hover:bg-gray-100"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Public Listing
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!hasUnsavedChanges || saveMutation.isPending}
                className="bg-[#135341] hover:bg-[#09261E] text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
          
          {/* Bottom row - Title and address */}
          <div>
            <h1 className="text-2xl font-semibold text-[#09261E]">Edit Property</h1>
            <p className="text-gray-600">{editData.address}</p>
          </div>
        </div>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-orange-800">You have unsaved changes</span>
                </div>
                <Button size="sm" onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white">
                  Save Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Edit Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center space-x-2 ${
                      activeSection === section.id
                        ? 'bg-[#135341] text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    <span>{section.label}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Section Selector */}
            <div className="lg:hidden mb-6">
              <Select value={activeSection} onValueChange={setActiveSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section to edit" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      <div className="flex items-center space-x-2">
                        <section.icon className="h-4 w-4" />
                        <span>{section.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Step 1: Property Information */}
            {activeSection === 'info' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Home className="h-5 w-5" />
                    <span>Step 1: Property Information</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">Enter the essential details about your property</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Property Address
                      </Label>
                      <Input
                        id="address"
                        value={editData.address}
                        onChange={(e) => handleFieldChange('address', e.target.value)}
                        placeholder="Enter the full property address"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Address information will be used to automatically fill property details
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title" className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-muted-foreground" />
                          Property Title
                        </Label>
                        <Input
                          id="title"
                          value={editData.title}
                          onChange={(e) => handleFieldChange('title', e.target.value)}
                          placeholder="e.g. Colonial Single Family"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          A descriptive title helps buyers identify your property
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="propertyType" className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          Property Type
                        </Label>
                        <Select
                          value={editData.propertyType}
                          onValueChange={(value) => handleFieldChange('propertyType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Single Family">Single Family</SelectItem>
                            <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                            <SelectItem value="Duplex">Duplex</SelectItem>
                            <SelectItem value="Condo">Condo</SelectItem>
                            <SelectItem value="Vacant Land">Vacant Land</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={editData.city}
                          onChange={(e) => handleFieldChange('city', e.target.value)}
                          placeholder="e.g. Chicago"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={editData.state}
                          onChange={(e) => handleFieldChange('state', e.target.value)}
                          placeholder="e.g. IL"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input
                          id="zipCode"
                          value={editData.zipCode}
                          onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                          placeholder="e.g. 60601"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          value={editData.bedrooms}
                          onChange={(e) => handleFieldChange('bedrooms', parseInt(e.target.value) || 0)}
                          placeholder="e.g. 3"
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          step="0.5"
                          value={editData.bathrooms}
                          onChange={(e) => handleFieldChange('bathrooms', parseFloat(e.target.value) || 0)}
                          placeholder="e.g. 2.5"
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="yearBuilt">Year Built</Label>
                        <Input
                          id="yearBuilt"
                          type="number"
                          value={editData.yearBuilt || ''}
                          onChange={(e) => handleFieldChange('yearBuilt', parseInt(e.target.value) || undefined)}
                          placeholder="e.g. 1990"
                          min="1800"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="squareFeet">Square Footage</Label>
                        <Input
                          id="squareFeet"
                          type="number"
                          value={editData.squareFeet}
                          onChange={(e) => handleFieldChange('squareFeet', parseInt(e.target.value) || 0)}
                          placeholder="e.g. 2500"
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lotSize">Lot Size</Label>
                        <Input
                          id="lotSize"
                          value={editData.lotSize || ''}
                          onChange={(e) => handleFieldChange('lotSize', e.target.value)}
                          placeholder="e.g. 0.25 acres"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="county">County (optional)</Label>
                        <Input
                          id="county"
                          value={editData.county || ''}
                          onChange={(e) => handleFieldChange('county', e.target.value)}
                          placeholder="e.g. Cook County"
                        />
                      </div>
                      <div>
                        <Label htmlFor="parcelId">Parcel ID / APN (optional)</Label>
                        <Input
                          id="parcelId"
                          value={editData.parcelId || ''}
                          onChange={(e) => handleFieldChange('parcelId', e.target.value)}
                          placeholder="e.g. 14-21-106-017-0000"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Property Media */}
            {activeSection === 'media' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Core Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={editData.bedrooms}
                        onChange={(e) => handleFieldChange('bedrooms', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        step="0.5"
                        value={editData.bathrooms}
                        onChange={(e) => handleFieldChange('bathrooms', parseFloat(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="squareFeet">Square Feet</Label>
                      <Input
                        id="squareFeet"
                        type="number"
                        value={editData.squareFeet}
                        onChange={(e) => handleFieldChange('squareFeet', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="lotSize">Lot Size (sq ft)</Label>
                      <Input
                        id="lotSize"
                        type="number"
                        value={editData.lotSize || ''}
                        onChange={(e) => handleFieldChange('lotSize', parseInt(e.target.value) || undefined)}
                        placeholder="Optional"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="yearBuilt">Year Built</Label>
                      <Input
                        id="yearBuilt"
                        type="number"
                        value={editData.yearBuilt || ''}
                        onChange={(e) => handleFieldChange('yearBuilt', parseInt(e.target.value) || undefined)}
                        placeholder="e.g., 1990"
                        min="1800"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <div>
                      <Label htmlFor="condition">Condition</Label>
                      <Select
                        value={editData.condition}
                        onValueChange={(value) => handleFieldChange('condition', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Needs Work">Needs Work</SelectItem>
                          <SelectItem value="Fixer Upper">Fixer Upper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="occupancyStatus">Occupancy Status</Label>
                    <Select
                      value={editData.occupancyStatus}
                      onValueChange={(value) => handleFieldChange('occupancyStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vacant">Vacant</SelectItem>
                        <SelectItem value="Owner Occupied">Owner Occupied</SelectItem>
                        <SelectItem value="Tenant Occupied">Tenant Occupied</SelectItem>
                        <SelectItem value="Partially Occupied">Partially Occupied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Property Financials */}
            {activeSection === 'financials' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Step 3: Property Financials</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">Set your pricing, financial details, and investment information</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        Pricing Information
                      </Label>
                      <p className="text-sm text-gray-500 mb-4">
                        Set your pricing strategy and financial expectations
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="listingPrice">Listing Price *</Label>
                          <Input
                            id="listingPrice"
                            type="number"
                            value={editData.listingPrice}
                            onChange={(e) => handleFieldChange('listingPrice', parseInt(e.target.value) || 0)}
                            placeholder="e.g. 275000"
                            min="0"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Your asking price for this property
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="purchasePrice">Purchase Price (Optional)</Label>
                          <Input
                            id="purchasePrice"
                            type="number"
                            value={editData.purchasePrice || ''}
                            onChange={(e) => handleFieldChange('purchasePrice', parseInt(e.target.value) || undefined)}
                            placeholder="e.g. 225000"
                            min="0"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            What you paid for the property
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                        Investment Analysis
                      </Label>
                      <p className="text-sm text-gray-500 mb-4">
                        Help investors understand the deal potential
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="arv">ARV (After Repair Value)</Label>
                          <Input
                            id="arv"
                            type="number"
                            value={editData.arv || ''}
                            onChange={(e) => handleFieldChange('arv', parseInt(e.target.value) || undefined)}
                            placeholder="e.g. 350000"
                            min="0"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Estimated value after repairs
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="estimatedRepairs">Estimated Repairs</Label>
                          <Input
                            id="estimatedRepairs"
                            type="number"
                            value={editData.estimatedRepairs || ''}
                            onChange={(e) => handleFieldChange('estimatedRepairs', parseInt(e.target.value) || undefined)}
                            placeholder="e.g. 25000"
                            min="0"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Cost to bring property to retail condition
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        Rental Information (For Investment Properties)
                      </Label>
                      <p className="text-sm text-gray-500 mb-4">
                        Add rental details if this is an income-producing property
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="monthlyRent">Monthly Rent (Single Unit)</Label>
                          <Input
                            id="monthlyRent"
                            type="number"
                            value={editData.monthlyRent || ''}
                            onChange={(e) => handleFieldChange('monthlyRent', parseInt(e.target.value) || undefined)}
                            placeholder="e.g. 2500"
                            min="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="totalMonthlyRent">Total Monthly Rent (Multi-Unit)</Label>
                          <Input
                            id="totalMonthlyRent"
                            type="number"
                            value={editData.totalMonthlyRent || ''}
                            onChange={(e) => handleFieldChange('totalMonthlyRent', parseInt(e.target.value) || undefined)}
                            placeholder="e.g. 5000"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <Handshake className="h-4 w-4 text-muted-foreground" />
                        Deal Structure (Optional)
                      </Label>
                      <p className="text-sm text-gray-500 mb-4">
                        Specify assignment fees and partnership opportunities
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="assignmentFee">Assignment Fee</Label>
                          <Input
                            id="assignmentFee"
                            type="number"
                            value={editData.assignmentFee || ''}
                            onChange={(e) => handleFieldChange('assignmentFee', parseInt(e.target.value) || undefined)}
                            placeholder="e.g. 15000"
                            min="0"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Fee for assigning the contract
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Switch
                            id="jvAvailable"
                            checked={editData.jvAvailable || false}
                            onCheckedChange={(checked) => handleFieldChange('jvAvailable', checked)}
                          />
                          <Label htmlFor="jvAvailable">Joint Venture Available</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Listing Logistics */}
            {activeSection === 'logistics' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Step 4: Listing Logistics</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">Set up property access, showing instructions, and listing details</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        Property Access
                      </Label>
                      <p className="text-sm text-gray-500 mb-4">
                        Provide instructions for buyers and agents to access the property
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="accessType">Access Type</Label>
                          <Select
                            value={editData.accessType || ''}
                            onValueChange={(value) => handleFieldChange('accessType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select access method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lockbox">Lockbox</SelectItem>
                              <SelectItem value="key_pickup">Key Pickup</SelectItem>
                              <SelectItem value="appointment_only">Appointment Only</SelectItem>
                              <SelectItem value="occupied">Occupied - Tenant Coordination</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="lockboxCode">Lockbox Code (if applicable)</Label>
                          <Input
                            id="lockboxCode"
                            value={editData.lockboxCode || ''}
                            onChange={(e) => handleFieldChange('lockboxCode', e.target.value)}
                            placeholder="e.g. 1234"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="accessInstructions">Access Instructions</Label>
                        <Textarea
                          id="accessInstructions"
                          value={editData.accessInstructions || ''}
                          onChange={(e) => handleFieldChange('accessInstructions', e.target.value)}
                          placeholder="Detailed instructions for accessing the property..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Showing & Timeline
                      </Label>
                      <p className="text-sm text-gray-500 mb-4">
                        Set showing preferences and important dates
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="tenantAware"
                            checked={editData.tenantAware}
                            onCheckedChange={(checked) => handleFieldChange('tenantAware', checked)}
                          />
                          <Label htmlFor="tenantAware">Tenant Aware of Sale</Label>
                        </div>
                        <div>
                          <Label htmlFor="closingDate">Preferred Closing Date</Label>
                          <Input
                            id="closingDate"
                            type="date"
                            value={editData.closingDate || ''}
                            onChange={(e) => handleFieldChange('closingDate', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="showingNotes">Showing Notes</Label>
                        <Textarea
                          id="showingNotes"
                          value={editData.showingNotes || ''}
                          onChange={(e) => handleFieldChange('showingNotes', e.target.value)}
                          placeholder="Special instructions for showings, parking, pets, etc..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        Property Tags & Categories
                      </Label>
                      <p className="text-sm text-gray-500 mb-4">
                        Add tags to help buyers find your property
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Investment Strategy Tags</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {['Flip', 'Buy & Hold', 'BRRRR', 'Short-Term Rental', 'Live-In Flip', 'Wholesale'].map((tag) => (
                              <Button
                                key={tag}
                                variant={editData.strategyTags?.includes(tag) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const currentTags = editData.strategyTags || [];
                                  const updatedTags = currentTags.includes(tag)
                                    ? currentTags.filter(t => t !== tag)
                                    : [...currentTags, tag];
                                  handleFieldChange('strategyTags', updatedTags);
                                }}
                              >
                                {tag}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label>Property Condition Tags</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {['Move-In Ready', 'Cosmetic Updates', 'Moderate Rehab', 'Heavy Rehab', 'Tear Down'].map((tag) => (
                              <Button
                                key={tag}
                                variant={editData.conditionTags?.includes(tag) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const currentTags = editData.conditionTags || [];
                                  const updatedTags = currentTags.includes(tag)
                                    ? currentTags.filter(t => t !== tag)
                                    : [...currentTags, tag];
                                  handleFieldChange('conditionTags', updatedTags);
                                }}
                              >
                                {tag}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Review */}
            {activeSection === 'review' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Step 5: Review</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">Review your listing before publishing</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Property Description
                      </Label>
                      <p className="text-sm text-gray-500 mb-4">
                        Write a compelling description of your property
                      </p>
                      
                      <div>
                        <Label htmlFor="shortSummary">Short Summary (for cards & previews)</Label>
                        <Textarea
                          id="shortSummary"
                          value={editData.shortSummary}
                          onChange={(e) => handleFieldChange('shortSummary', e.target.value)}
                          placeholder="Brief, compelling summary for property cards..."
                          rows={2}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Keep it under 150 characters for best display
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Detailed Description</Label>
                        <Textarea
                          id="description"
                          value={editData.description}
                          onChange={(e) => handleFieldChange('description', e.target.value)}
                          placeholder="Detailed property description highlighting key features, location benefits, investment potential..."
                          rows={6}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        Listing Settings
                      </Label>
                      <p className="text-sm text-gray-500 mb-4">
                        Control how your listing appears and who can see it
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="status">Listing Status</Label>
                          <Select
                            value={editData.status}
                            onValueChange={(value: 'live' | 'draft') => handleFieldChange('status', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft (Not Visible)</SelectItem>
                              <SelectItem value="live">Live (Public)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Switch
                            id="isPublic"
                            checked={editData.isPublic}
                            onCheckedChange={(checked) => handleFieldChange('isPublic', checked)}
                          />
                          <Label htmlFor="isPublic">Public Listing</Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Listing Summary</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Property:</strong> {editData.title || 'No title set'}</p>
                        <p><strong>Address:</strong> {editData.address || 'No address set'}</p>
                        <p><strong>Type:</strong> {editData.propertyType || 'Not specified'}</p>
                        <p><strong>Price:</strong> ${editData.listingPrice?.toLocaleString() || 'Not set'}</p>
                        <p><strong>Status:</strong> {editData.status === 'live' ? 'Live' : 'Draft'}</p>
                        <p><strong>Public:</strong> {editData.isPublic ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Property Media - Complete Implementation */}
            {activeSection === 'media' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5" />
                    <span>Step 2: Property Media</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">Upload photos, videos, and documents to showcase your property</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        Property Photos
                      </Label>
                      <p className="text-sm text-gray-500 mb-3">
                        Upload high-quality photos that showcase your property's best features
                      </p>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                        <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-700">Drag & drop photos here</p>
                          <p className="text-sm text-gray-500">or click to browse your computer</p>
                          <p className="text-xs text-gray-400">Supports: JPG, PNG, HEIC (Max 10MB each)</p>
                        </div>
                        <Button className="mt-4" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Photos
                        </Button>
                      </div>

                      {editData.images && editData.images.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-3">Uploaded Photos ({editData.images.length})</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {editData.images.map((image, index) => (
                              <div key={index} className="relative group">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                  <img 
                                    src={image} 
                                    alt={`Property ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      const updatedImages = editData.images.filter((_, i) => i !== index);
                                      handleFieldChange('images', updatedImages);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                                {index === 0 && (
                                  <div className="absolute bottom-2 left-2">
                                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                                      Primary
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        Property Video (Optional)
                      </Label>
                      <p className="text-sm text-gray-500 mb-3">
                        Add a video tour to give buyers a comprehensive view of your property
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="videoUrl">Video URL</Label>
                          <Input
                            id="videoUrl"
                            value={editData.videoUrl || ''}
                            onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                            placeholder="Paste YouTube, Vimeo, or direct video link"
                          />
                        </div>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Video className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">or upload a video file</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Video
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Property Documents (Optional)
                      </Label>
                      <p className="text-sm text-gray-500 mb-3">
                        Upload relevant documents like floor plans, inspection reports, or property disclosures
                      </p>
                      
                      <div className="space-y-3">
                        {editData.documents && editData.documents.length > 0 && (
                          <div className="space-y-2">
                            {editData.documents.map((doc, index) => (
                              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <div>
                                    <p className="text-sm font-medium">{doc.name}</p>
                                    <p className="text-xs text-gray-500">{doc.type}</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const updatedDocs = editData.documents?.filter((_, i) => i !== index) || [];
                                    handleFieldChange('documents', updatedDocs);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Drag & drop documents here</p>
                          <p className="text-xs text-gray-400 mb-3">Supports: PDF, DOC, DOCX (Max 25MB each)</p>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Documents
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary & Access Section */}
            {activeSection === 'summary' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Summary & Access</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="shortSummary">Property Summary</Label>
                    <Input
                      id="shortSummary"
                      value={editData.shortSummary}
                      onChange={(e) => handleFieldChange('shortSummary', e.target.value)}
                      placeholder="Brief hook headline (e.g., 'Turnkey rental in desirable neighborhood')"
                      maxLength={100}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {editData.shortSummary.length}/100 characters
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Access & Logistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="lockboxCode">Lockbox Code</Label>
                        <Input
                          id="lockboxCode"
                          value={editData.lockboxCode || ''}
                          onChange={(e) => handleFieldChange('lockboxCode', e.target.value)}
                          placeholder="Optional"
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          id="tenantAware"
                          checked={editData.tenantAware}
                          onCheckedChange={(checked) => handleFieldChange('tenantAware', checked)}
                        />
                        <Label htmlFor="tenantAware">Tenant is aware of sale</Label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accessInstructions">Access Instructions</Label>
                      <Textarea
                        id="accessInstructions"
                        value={editData.accessInstructions || ''}
                        onChange={(e) => handleFieldChange('accessInstructions', e.target.value)}
                        placeholder="How to access the property for showings..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="showingNotes">Showing Availability Notes</Label>
                      <Textarea
                        id="showingNotes"
                        value={editData.showingNotes || ''}
                        onChange={(e) => handleFieldChange('showingNotes', e.target.value)}
                        placeholder="Best times for showings, special requirements, etc."
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Investment Strategy Tags</h3>
                    <div className="space-y-3">
                      <div>
                        <Label>Strategy Type</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['Buy & Hold', 'Flip', 'BRRRR', 'Wholesale', 'JV Partnership'].map((tag) => (
                            <Badge
                              key={tag}
                              variant={editData.strategyTags.includes(tag) ? "default" : "outline"}
                              className={`cursor-pointer ${
                                editData.strategyTags.includes(tag) 
                                  ? 'bg-[#135341] text-white' 
                                  : 'hover:bg-gray-100'
                              }`}
                              onClick={() => {
                                const currentTags = editData.strategyTags;
                                const newTags = currentTags.includes(tag)
                                  ? currentTags.filter(t => t !== tag)
                                  : [...currentTags, tag];
                                handleFieldChange('strategyTags', newTags);
                              }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Condition Tags</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['Move-In Ready', 'Light Rehab', 'Heavy Rehab', 'Full Gut', 'Tear Down'].map((tag) => (
                            <Badge
                              key={tag}
                              variant={editData.conditionTags.includes(tag) ? "default" : "outline"}
                              className={`cursor-pointer ${
                                editData.conditionTags.includes(tag) 
                                  ? 'bg-[#135341] text-white' 
                                  : 'hover:bg-gray-100'
                              }`}
                              onClick={() => {
                                const currentTags = editData.conditionTags;
                                const newTags = currentTags.includes(tag)
                                  ? currentTags.filter(t => t !== tag)
                                  : [...currentTags, tag];
                                handleFieldChange('conditionTags', newTags);
                              }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="saleType">Sale Type</Label>
                    <Select
                      value={editData.saleType}
                      onValueChange={(value) => handleFieldChange('saleType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Direct Sale">Direct Sale</SelectItem>
                        <SelectItem value="Assignment">Assignment</SelectItem>
                        <SelectItem value="JV Partnership">JV Partnership</SelectItem>
                        <SelectItem value="Wholesale">Wholesale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </SellerDashboardLayout>
  );
}