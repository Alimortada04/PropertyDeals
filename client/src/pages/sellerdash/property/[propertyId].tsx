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
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'logistics', label: 'Logistics', icon: MapPin },
    { id: 'description', label: 'Property Description', icon: FileText }
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
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                  {/* Property Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">
                      Property Address
                    </Label>
                    <Input
                      id="address"
                      value={editData.address}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                      placeholder="Enter the full property address"
                      className="h-11"
                    />
                    <p className="text-sm text-gray-500">
                      Note: Auto-fill logic active
                    </p>
                  </div>

                  {/* Property Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Property Title
                    </Label>
                    <Input
                      id="title"
                      value={editData.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      placeholder="e.g. Colonial Single Family"
                      className="h-11"
                    />
                    <p className="text-sm text-gray-500">
                      A descriptive title helps buyers identify your property
                    </p>
                  </div>

                  {/* Property Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Property Type</Label>
                    <Select value={editData.propertyType} onValueChange={(value) => handleFieldChange('propertyType', value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single Family">Single Family</SelectItem>
                        <SelectItem value="Multi Family">Multi Family</SelectItem>
                        <SelectItem value="Condo">Condo</SelectItem>
                        <SelectItem value="Townhouse">Townhouse</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* City | State | Zip Code */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">City</Label>
                      <Input
                        id="city"
                        value={editData.city}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                        placeholder="e.g. Chicago"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">State</Label>
                      <Input
                        id="state"
                        value={editData.state}
                        onChange={(e) => handleFieldChange('state', e.target.value)}
                        placeholder="e.g. IL"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-sm font-medium">Zip Code</Label>
                      <Input
                        id="zipCode"
                        value={editData.zipCode}
                        onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                        placeholder="e.g. 60601"
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* Bedrooms | Bathrooms | Year Built */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms" className="text-sm font-medium">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={editData.bedrooms}
                        onChange={(e) => handleFieldChange('bedrooms', parseInt(e.target.value) || 0)}
                        placeholder="e.g. 3"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bathrooms" className="text-sm font-medium">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        step="0.5"
                        value={editData.bathrooms}
                        onChange={(e) => handleFieldChange('bathrooms', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 2.5"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearBuilt" className="text-sm font-medium">Year Built</Label>
                      <Input
                        id="yearBuilt"
                        type="number"
                        value={editData.yearBuilt || ''}
                        onChange={(e) => handleFieldChange('yearBuilt', parseInt(e.target.value) || undefined)}
                        placeholder="e.g. 1990"
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* Square Footage | Lot Size */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="squareFeet" className="text-sm font-medium">Square Footage</Label>
                      <Input
                        id="squareFeet"
                        type="number"
                        value={editData.squareFeet}
                        onChange={(e) => handleFieldChange('squareFeet', parseInt(e.target.value) || 0)}
                        placeholder="e.g. 2500"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lotSize" className="text-sm font-medium">Lot Size</Label>
                      <Input
                        id="lotSize"
                        value={editData.lotSize || ''}
                        onChange={(e) => handleFieldChange('lotSize', e.target.value)}
                        placeholder="e.g. 0.25 acres"
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* County (optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="county" className="text-sm font-medium">County (optional)</Label>
                    <Input
                      id="county"
                      value={editData.county || ''}
                      onChange={(e) => handleFieldChange('county', e.target.value)}
                      placeholder="e.g. Cook County"
                      className="h-11"
                    />
                  </div>

                  {/* Parcel ID / APN (optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="parcelId" className="text-sm font-medium">Parcel ID / APN (optional)</Label>
                    <Input
                      id="parcelId"
                      value={editData.parcelId || ''}
                      onChange={(e) => handleFieldChange('parcelId', e.target.value)}
                      placeholder="e.g. 14-21-106-017-0000"
                      className="h-11"
                    />
                  </div>

                  {/* Save as Draft - Bottom padding */}
                  <div className="pt-6 pb-8">
                    <Button 
                      variant="outline" 
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                      className="w-full"
                    >
                      {saveMutation.isPending ? 'Saving as Draft...' : 'Save as Draft'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Media */}
            {activeSection === 'media' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5" />
                    <span>Step 2: Media</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                  {/* Primary Image */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Primary Image (upload/dropzone)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Label htmlFor="primary-image" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload primary property image
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </span>
                        </Label>
                        <Input id="primary-image" type="file" accept="image/*" className="hidden" />
                      </div>
                    </div>
                  </div>

                  {/* Gallery Images */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Gallery Images (multi-upload)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Label htmlFor="gallery-images" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload gallery images
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">
                            Select multiple images, PNG, JPG, GIF up to 10MB each
                          </span>
                        </Label>
                        <Input id="gallery-images" type="file" accept="image/*" multiple className="hidden" />
                      </div>
                    </div>
                  </div>

                  {/* Video Walkthrough */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Video Walkthrough</Label>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Option 1: Paste YouTube/Vimeo/Drive link</Label>
                        <Input
                          value={editData.videoUrl || ''}
                          onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="h-11"
                        />
                      </div>

                      <div className="text-center text-sm text-gray-500">— OR —</div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Option 2: Upload MP4/WebM</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <Video className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="mt-2">
                            <Label htmlFor="video-upload" className="cursor-pointer">
                              <span className="block text-sm font-medium text-gray-900">
                                Upload video file
                              </span>
                              <span className="block text-xs text-gray-500">
                                MP4, WebM up to 100MB
                              </span>
                            </Label>
                            <Input id="video-upload" type="file" accept="video/*" className="hidden" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save as Draft - Bottom padding */}
                  <div className="pt-6 pb-8">
                    <Button 
                      variant="outline" 
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                      className="w-full"
                    >
                      {saveMutation.isPending ? 'Saving as Draft...' : 'Save as Draft'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Finance */}
            {activeSection === 'finance' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Step 3: Finance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                  {/* Rental Income */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Rental Income</Label>
                      <Label htmlFor="totalMonthlyRent" className="text-sm text-gray-600">Total Monthly Rent</Label>
                      <Input
                        id="totalMonthlyRent"
                        type="number"
                        value={editData.totalMonthlyRent || ''}
                        onChange={(e) => handleFieldChange('totalMonthlyRent', parseFloat(e.target.value) || undefined)}
                        placeholder="e.g. 2500"
                        className="h-11"
                      />
                      <p className="text-sm text-gray-500">
                        Enter the total monthly rental income for this property
                      </p>
                    </div>
                  </div>

                  {/* Unit Breakdown */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Unit Breakdown (Required for Multi-family)</Label>
                    <div className="border rounded-lg p-4">
                      {(!editData.units || editData.units.length === 0) ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">No units added yet.</p>
                          <Button variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Unit
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {editData.units.map((unit, index) => (
                            <div key={unit.id} className="border rounded p-4 space-y-2">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">Unit {index + 1}</h4>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              {/* Unit details would go here */}
                            </div>
                          ))}
                          <Button variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Unit
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expenses */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Expenses</Label>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700">
                          <span>Expense Name</span>
                          <span>Amount</span>
                          <span>Frequency</span>
                        </div>
                      </div>
                      <div className="divide-y">
                        {/* Default expense rows */}
                        <div className="grid grid-cols-3 gap-4 p-4 items-center">
                          <Input placeholder="Property Tax" defaultValue="Property Tax" />
                          <Input type="number" placeholder="0" />
                          <Select defaultValue="annually">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="annually">Annually</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-4 p-4 items-center">
                          <Input placeholder="Insurance" defaultValue="Insurance" />
                          <Input type="number" placeholder="0" />
                          <Select defaultValue="annually">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="annually">Annually</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-4 p-4 items-center">
                          <Input placeholder="Utilities" defaultValue="Utilities" />
                          <Input type="number" placeholder="0" />
                          <Select defaultValue="monthly">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="annually">Annually</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="p-4 border-t bg-gray-50">
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Expense
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Total: $0</span>
                      <span>Annual Total: $0</span>
                    </div>
                  </div>

                  {/* Property Condition & Repairs */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Property Condition & Repairs</Label>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Condition</Label>
                        <Select value={editData.condition} onValueChange={(value) => handleFieldChange('condition', value)}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good – Minor Repairs Needed">Good – Minor Repairs Needed</SelectItem>
                            <SelectItem value="Fair – Some Repairs Needed">Fair – Some Repairs Needed</SelectItem>
                            <SelectItem value="Poor – Major Repairs Needed">Poor – Major Repairs Needed</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-500">
                          Accurately describe the condition to set buyer expectations
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Repair Projects</Label>
                        <div className="border rounded-lg p-4">
                          <p className="text-gray-500 mb-4">No repair projects added yet.</p>
                          <Button variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Repair
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save as Draft - Bottom padding */}
                  <div className="pt-6 pb-8">
                    <Button 
                      variant="outline" 
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                      className="w-full"
                    >
                      {saveMutation.isPending ? 'Saving as Draft...' : 'Save as Draft'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Logistics */}
            {activeSection === 'logistics' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Step 4: Logistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                  {/* Purchase Price */}
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice" className="text-sm font-medium">Purchase Price</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      value={editData.purchasePrice || ''}
                      onChange={(e) => handleFieldChange('purchasePrice', parseFloat(e.target.value) || undefined)}
                      placeholder="e.g. 200000"
                      className="h-11"
                    />
                  </div>

                  {/* Listing Price */}
                  <div className="space-y-2">
                    <Label htmlFor="listingPrice" className="text-sm font-medium">Listing Price</Label>
                    <Input
                      id="listingPrice"
                      type="number"
                      value={editData.listingPrice || editData.price}
                      onChange={(e) => handleFieldChange('listingPrice', parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 225000"
                      className="h-11"
                    />
                  </div>

                  {/* Assignment Fee */}
                  <div className="space-y-2">
                    <Label htmlFor="assignmentFee" className="text-sm font-medium">Assignment Fee</Label>
                    <Input
                      id="assignmentFee"
                      type="number"
                      value={
                        editData.assignmentFee || 
                        ((editData.listingPrice || editData.price || 0) - (editData.purchasePrice || 0)) || ''
                      }
                      onChange={(e) => handleFieldChange('assignmentFee', parseFloat(e.target.value) || undefined)}
                      placeholder="Auto-calculated: Listing Price - Purchase Price"
                      className="h-11"
                      disabled
                    />
                    <p className="text-sm text-gray-500">
                      Auto-calculated field: Listing Price - Purchase Price
                    </p>
                  </div>

                  {/* Access Type */}
                  <div className="space-y-2">
                    <Label htmlFor="accessType" className="text-sm font-medium">Access Type</Label>
                    <Input
                      id="accessType"
                      value={editData.accessType || ''}
                      onChange={(e) => handleFieldChange('accessType', e.target.value)}
                      placeholder="How can buyers access the property?"
                      className="h-11"
                    />
                  </div>

                  {/* Closing Date */}
                  <div className="space-y-2">
                    <Label htmlFor="closingDate" className="text-sm font-medium">Closing Date (Optional)</Label>
                    <Input
                      id="closingDate"
                      type="date"
                      value={editData.closingDate || ''}
                      onChange={(e) => handleFieldChange('closingDate', e.target.value)}
                      className="h-11"
                    />
                    <p className="text-sm text-gray-500">
                      Expected closing date (if known)
                    </p>
                  </div>

                  {/* Documentation Upload */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Documentation Upload</Label>
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Purchase Agreement</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="mt-2">
                          <Label htmlFor="purchase-agreement" className="cursor-pointer">
                            <span className="block text-sm font-medium text-gray-900">
                              Drag & drop or click to upload
                            </span>
                            <span className="block text-xs text-gray-500">
                              Accept PDF, DOC, DOCX, max 10MB
                            </span>
                          </Label>
                          <Input id="purchase-agreement" type="file" accept=".pdf,.doc,.docx" className="hidden" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        You can upload this later, but it's required before publishing.
                      </p>
                    </div>
                  </div>

                  {/* Partners & Notes */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Partners</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Enter partner name" className="h-11" />
                        <Button variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">No partners added yet</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                      <Textarea
                        id="notes"
                        value={editData.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        placeholder="Special conditions, instructions for buyers, or other important details... This information will be shown to potential buyers"
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </div>

                  {/* Save as Draft - Bottom padding */}
                  <div className="pt-6 pb-8">
                    <Button 
                      variant="outline" 
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                      className="w-full"
                    >
                      {saveMutation.isPending ? 'Saving as Draft...' : 'Save as Draft'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Property Description */}
            {activeSection === 'description' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Step 5: Property Description</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                  {/* AI-Generated Description */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">AI-Generated Description</Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">Tone</Label>
                        <Select defaultValue="professional">
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                            <SelectItem value="luxury">Luxury</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">Type</Label>
                        <Select defaultValue="standard">
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard Listing</SelectItem>
                            <SelectItem value="investment">Investment Focus</SelectItem>
                            <SelectItem value="family">Family Oriented</SelectItem>
                            <SelectItem value="luxury">Luxury Market</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Regenerate Description
                    </Button>

                    <div className="space-y-2">
                      <Label htmlFor="aiDescription" className="text-sm font-medium">Description Output</Label>
                      <Textarea
                        id="aiDescription"
                        value={editData.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        placeholder="AI-generated property description will appear here..."
                        rows={8}
                        className="resize-none"
                      />
                      <p className="text-sm text-gray-500">
                        You can edit this description or regenerate with different settings
                      </p>
                    </div>
                  </div>

                  {/* Save as Draft - Bottom padding */}
                  <div className="pt-6 pb-8">
                    <Button 
                      variant="outline" 
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                      className="w-full"
                    >
                      {saveMutation.isPending ? 'Saving as Draft...' : 'Save as Draft'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Global Save as Draft Button - Always visible at bottom */}
          <div className="fixed bottom-6 right-6 lg:right-8 z-50">
            <Button 
              onClick={handleSave}
              disabled={!hasUnsavedChanges || saveMutation.isPending}
              className="bg-[#135341] hover:bg-[#09261E] text-white shadow-lg"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveMutation.isPending ? 'Saving...' : 'Save as Draft'}
            </Button>
          </div>
        </div>
      </div>
    </SellerDashboardLayout>
  );
}
