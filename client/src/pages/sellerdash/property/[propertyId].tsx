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
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-2">
                    <Home className="h-5 w-5" />
                    <span>Step 1: Property Information</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">Enter the essential details about your property</p>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="space-y-6">
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
                        className="mt-2"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Note: Auto-fill logic active
                      </p>
                    </div>

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
                        className="mt-2"
                      />
                      <p className="text-sm text-gray-500 mt-2">
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
                        <SelectTrigger className="mt-2">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={editData.city}
                          onChange={(e) => handleFieldChange('city', e.target.value)}
                          placeholder="e.g. Chicago"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={editData.state}
                          onChange={(e) => handleFieldChange('state', e.target.value)}
                          placeholder="e.g. IL"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input
                          id="zipCode"
                          value={editData.zipCode}
                          onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                          placeholder="e.g. 60601"
                          className="mt-2"
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

            {/* Step 2: Media */}
            {activeSection === 'media' && (
              <Card>
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5" />
                    <span>Step 2: Media</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">Upload property images and video walkthrough</p>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="space-y-6">
                    {/* Primary Image */}
                    <div>
                      <Label className="text-base font-medium">Primary Image</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>

                    {/* Gallery Images */}
                    <div>
                      <Label className="text-base font-medium">Gallery Images</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">Upload multiple images</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                      </div>
                    </div>

                    {/* Video Walkthrough */}
                    <div>
                      <Label className="text-base font-medium">Video Walkthrough</Label>
                      <div className="mt-2 space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Option 1: Paste YouTube/Vimeo/Drive link</Label>
                          <Input
                            value={editData.videoUrl || ''}
                            onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="mt-2"
                          />
                        </div>
                        <div className="text-center text-sm text-gray-500">or</div>
                        <div>
                          <Label className="text-sm font-medium">Option 2: Upload MP4/WebM</Label>
                          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                            <VideoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Upload video file</p>
                            <p className="text-xs text-gray-500">MP4, WebM up to 100MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save as Draft Button */}
                  <div className="flex justify-end pt-6 border-t">
                    <Button 
                      variant="outline" 
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? 'Saving...' : 'Save as Draft'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Finance */}
            {activeSection === 'finance' && (
              <Card>
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Step 3: Finance</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">Financial details and rental income information</p>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="space-y-6">
                    {/* Rental Income */}
                    <div>
                      <Label className="text-base font-medium">Rental Income</Label>
                      <div className="mt-2">
                        <Label htmlFor="monthlyRent">Total Monthly Rent</Label>
                        <Input
                          id="monthlyRent"
                          type="number"
                          value={editData.monthlyRent || ''}
                          onChange={(e) => handleFieldChange('monthlyRent', parseInt(e.target.value) || null)}
                          placeholder="e.g. 2500"
                          className="mt-2"
                        />
                        <p className="text-sm text-gray-500 mt-1">Enter the total monthly rental income for this property</p>
                      </div>
                    </div>

                    {/* Unit Breakdown - Show for Multi-family */}
                    {editData.propertyType === 'Multi-Family' && (
                      <div>
                        <Label className="text-base font-medium">Unit Breakdown (Required for Multi-family)</Label>
                        <div className="mt-2 p-4 border border-gray-200 rounded-lg">
                          {editData.units && editData.units.length > 0 ? (
                            <div className="space-y-2">
                              {editData.units.map((unit: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span>Unit {index + 1}: {unit.bedrooms}BR/{unit.bathrooms}BA - ${unit.rent}/month</span>
                                  <Button size="sm" variant="ghost">Remove</Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center py-4">No units added yet.</p>
                          )}
                          <Button className="w-full mt-4" variant="outline">Add Unit</Button>
                        </div>
                      </div>
                    )}

                    {/* Expenses */}
                    <div>
                      <Label className="text-base font-medium">Expenses</Label>
                      <div className="mt-2">
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Expense Name</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Frequency</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-t border-gray-200">
                                <td className="px-4 py-2">Property Tax</td>
                                <td className="px-4 py-2">
                                  <Input 
                                    type="number" 
                                    value={editData.propertyTaxes || ''} 
                                    onChange={(e) => handleFieldChange('propertyTaxes', parseInt(e.target.value) || null)}
                                    placeholder="0"
                                    className="w-24"
                                  />
                                </td>
                                <td className="px-4 py-2">Annual</td>
                              </tr>
                              <tr className="border-t border-gray-200">
                                <td className="px-4 py-2">Insurance</td>
                                <td className="px-4 py-2">
                                  <Input 
                                    type="number" 
                                    value={editData.insurance || ''} 
                                    onChange={(e) => handleFieldChange('insurance', parseInt(e.target.value) || null)}
                                    placeholder="0"
                                    className="w-24"
                                  />
                                </td>
                                <td className="px-4 py-2">Annual</td>
                              </tr>
                              <tr className="border-t border-gray-200">
                                <td className="px-4 py-2">Utilities</td>
                                <td className="px-4 py-2">
                                  <Input 
                                    type="number" 
                                    value={editData.utilities || ''} 
                                    onChange={(e) => handleFieldChange('utilities', parseInt(e.target.value) || null)}
                                    placeholder="0"
                                    className="w-24"
                                  />
                                </td>
                                <td className="px-4 py-2">Monthly</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <Button className="mt-2" variant="outline" size="sm">Add Expense</Button>
                      </div>
                    </div>

                    {/* Property Condition & Repairs */}
                    <div>
                      <Label className="text-base font-medium">Property Condition & Repairs</Label>
                      <div className="mt-2 space-y-4">
                        <div>
                          <Label htmlFor="condition">Condition</Label>
                          <Select
                            value={editData.condition}
                            onValueChange={(value) => handleFieldChange('condition', value)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Excellent">Excellent</SelectItem>
                              <SelectItem value="Good">Good – Minor Repairs Needed</SelectItem>
                              <SelectItem value="Fair">Fair – Major Repairs Needed</SelectItem>
                              <SelectItem value="Poor">Poor – Extensive Repairs Needed</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-gray-500 mt-1">Accurately describe the condition to set buyer expectations</p>
                        </div>
                        <div>
                          <Label htmlFor="estimatedRepairs">Estimated Repair Cost</Label>
                          <Input
                            id="estimatedRepairs"
                            type="number"
                            value={editData.estimatedRepairs || ''}
                            onChange={(e) => handleFieldChange('estimatedRepairs', parseInt(e.target.value) || null)}
                            placeholder="e.g. 15000"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Button variant="outline" size="sm">Add Repair Project</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save as Draft Button */}
                  <div className="flex justify-end pt-6 border-t">
                    <Button 
                      variant="outline" 
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? 'Saving...' : 'Save as Draft'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Logistics */}
            {activeSection === 'logistics' && (
              <Card>
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Step 4: Logistics</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">Pricing, access, and closing details</p>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="space-y-6">
                    {/* Purchase Price */}
                    <div>
                      <Label htmlFor="purchasePrice">Purchase Price</Label>
                      <Input
                        id="purchasePrice"
                        type="number"
                        value={editData.purchasePrice || ''}
                        onChange={(e) => handleFieldChange('purchasePrice', parseInt(e.target.value) || null)}
                        placeholder="e.g. 200000"
                        className="mt-2"
                      />
                    </div>

                    {/* Listing Price */}
                    <div>
                      <Label htmlFor="price">Listing Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={editData.price}
                        onChange={(e) => handleFieldChange('price', parseInt(e.target.value) || 0)}
                        placeholder="e.g. 225000"
                        className="mt-2"
                      />
                    </div>

                    {/* Assignment Fee - Auto-calculated */}
                    <div>
                      <Label>Assignment Fee</Label>
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <span className="text-lg font-medium">
                          ${((editData.price || 0) - (editData.purchasePrice || 0)).toLocaleString()}
                        </span>
                        <p className="text-sm text-gray-500">Listing Price - Purchase Price</p>
                      </div>
                    </div>

                    {/* Access Type */}
                    <div>
                      <Label htmlFor="accessInstructions">Access Type</Label>
                      <Textarea
                        id="accessInstructions"
                        value={editData.accessInstructions || ''}
                        onChange={(e) => handleFieldChange('accessInstructions', e.target.value)}
                        placeholder="How can buyers access the property?"
                        className="mt-2"
                      />
                    </div>

                    {/* Closing Date */}
                    <div>
                      <Label htmlFor="closingDate">Closing Date (Optional)</Label>
                      <Input
                        id="closingDate"
                        type="date"
                        value={editData.closingDate || ''}
                        onChange={(e) => handleFieldChange('closingDate', e.target.value)}
                        className="mt-2"
                      />
                      <p className="text-sm text-gray-500 mt-1">Expected closing date (if known)</p>
                    </div>

                    {/* Documentation Upload */}
                    <div>
                      <Label className="text-base font-medium">Documentation Upload</Label>
                      <div className="mt-2">
                        <Label className="text-sm font-medium">Purchase Agreement</Label>
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                          <p className="text-xs text-gray-500">Accept PDF, DOC, DOCX, max 10MB</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">You can upload this later, but it's required before publishing.</p>
                      </div>
                    </div>

                    {/* Partners & Notes */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-medium">Partners</Label>
                        <div className="mt-2 flex gap-2">
                          <Input placeholder="Enter partner name" className="flex-1" />
                          <Button variant="outline">Add</Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">No partners added yet</p>
                      </div>

                      <div>
                        <Label htmlFor="showingNotes" className="text-base font-medium">Notes</Label>
                        <Textarea
                          id="showingNotes"
                          value={editData.showingNotes || ''}
                          onChange={(e) => handleFieldChange('showingNotes', e.target.value)}
                          placeholder="Special conditions, instructions for buyers, or other important details... This information will be shown to potential buyers"
                          rows={4}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save as Draft Button */}
                  <div className="flex justify-end pt-6 border-t">
                    <Button 
                      variant="outline" 
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? 'Saving...' : 'Save as Draft'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Property Description (Replace Review) */}
            {activeSection === 'description' && (
              <Card>
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Step 5: Property Description</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">Generate or edit your property description</p>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="space-y-6">
                    {/* AI Description Generator */}
                    <div>
                      <Label className="text-base font-medium">AI-Generated Description</Label>
                      <div className="mt-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="tone">Tone</Label>
                            <Select defaultValue="professional">
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select tone" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="casual">Casual</SelectItem>
                                <SelectItem value="luxury">Luxury</SelectItem>
                                <SelectItem value="investor">Investor-Focused</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="type">Type</Label>
                            <Select defaultValue="standard">
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard Listing</SelectItem>
                                <SelectItem value="detailed">Detailed Analysis</SelectItem>
                                <SelectItem value="brief">Brief Overview</SelectItem>
                                <SelectItem value="investment">Investment Focused</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          <Wand2 className="h-4 w-4 mr-2" />
                          Regenerate Description
                        </Button>
                      </div>
                    </div>

                    {/* Description Output */}
                    <div>
                      <Label htmlFor="description">Property Description</Label>
                      <Textarea
                        id="description"
                        value={editData.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        placeholder="Property description will appear here..."
                        rows={8}
                        className="mt-2"
                      />
                      <p className="text-sm text-gray-500 mt-2">You can edit this description or regenerate with different settings</p>
                    </div>
                  </div>

                  {/* Save as Draft Button */}
                  <div className="flex justify-end pt-6 border-t">
                    <Button 
                      variant="outline" 
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? 'Saving...' : 'Save as Draft'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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

                  {/* Save as Draft Button */}
                  <div className="flex justify-end pt-6 border-t">
                    <Button 
                      variant="outline" 
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? 'Saving...' : 'Save as Draft'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSave}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button 
              onClick={() => handlePublish()}
              disabled={editData.status === 'live'}
            >
              {editData.status === 'live' ? 'Published' : 'Publish Property'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

