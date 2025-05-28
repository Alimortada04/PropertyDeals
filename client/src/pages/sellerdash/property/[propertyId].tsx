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
  ExternalLink
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
  status: 'live' | 'draft';
  isPublic: boolean;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize?: number;
  yearBuilt?: number;
  condition: string;
  occupancyStatus: string;
  price: number;
  arv?: number;
  estimatedRepairs?: number;
  monthlyRent?: number;
  assignmentFee?: number;
  jvAvailable?: boolean;
  propertyTaxes?: number;
  insurance?: number;
  utilities?: number;
  hoaFees?: number;
  shortSummary: string;
  description: string;
  images: string[];
  videoUrl?: string;
  units?: Array<{
    id: string;
    beds: number;
    baths: number;
    rent: number;
    sqft: number;
    status: 'vacant' | 'occupied';
  }>;
  documents?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
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
  const [activeSection, setActiveSection] = useState('overview');
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
    { id: 'overview', label: 'Property Overview', icon: Home },
    { id: 'details', label: 'Property Details', icon: Building },
    { id: 'media', label: 'Media & Files', icon: ImageIcon },
    { id: 'financial', label: 'Pricing & Terms', icon: DollarSign },
    { id: 'summary', label: 'Summary & Access', icon: FileText }
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

            {/* Property Overview Section */}
            {activeSection === 'overview' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Home className="h-5 w-5" />
                    <span>Property Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Property Title</Label>
                      <Input
                        id="title"
                        value={editData.title}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        placeholder="e.g., Modern Farmhouse"
                      />
                    </div>
                    <div>
                      <Label htmlFor="propertyType">Property Type</Label>
                      <Select
                        value={editData.propertyType}
                        onValueChange={(value) => handleFieldChange('propertyType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single Family">Single Family</SelectItem>
                          <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                          <SelectItem value="Condo">Condo</SelectItem>
                          <SelectItem value="Townhouse">Townhouse</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Land">Land</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          value={editData.address}
                          onChange={(e) => handleFieldChange('address', e.target.value)}
                          placeholder="123 Main St"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={editData.city}
                          onChange={(e) => handleFieldChange('city', e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={editData.state}
                          onChange={(e) => handleFieldChange('state', e.target.value)}
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={editData.zipCode}
                          onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                          placeholder="12345"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Status & Visibility</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="live">Live</SelectItem>
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
                </CardContent>
              </Card>
            )}

            {/* Core Details Section */}
            {activeSection === 'details' && (
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

            {/* Pricing & Terms Section */}
            {activeSection === 'financial' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Pricing & Terms</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Listing Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={editData.price}
                        onChange={(e) => handleFieldChange('price', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Your asking price for this property
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="arv">ARV (After Repair Value)</Label>
                      <Input
                        id="arv"
                        type="number"
                        value={editData.arv || ''}
                        onChange={(e) => handleFieldChange('arv', parseInt(e.target.value) || undefined)}
                        placeholder="Optional"
                        min="0"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Estimated value after repairs
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estimatedRepairs">Estimated Repairs</Label>
                      <Input
                        id="estimatedRepairs"
                        type="number"
                        value={editData.estimatedRepairs || ''}
                        onChange={(e) => handleFieldChange('estimatedRepairs', parseInt(e.target.value) || undefined)}
                        placeholder="Optional"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthlyRent">Monthly Rent</Label>
                      <Input
                        id="monthlyRent"
                        type="number"
                        value={editData.monthlyRent || ''}
                        onChange={(e) => handleFieldChange('monthlyRent', parseInt(e.target.value) || undefined)}
                        placeholder="Actual or projected"
                        min="0"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Assignment & Partnership Terms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="assignmentFee">Assignment Fee</Label>
                        <Input
                          id="assignmentFee"
                          type="number"
                          value={editData.assignmentFee || ''}
                          onChange={(e) => handleFieldChange('assignmentFee', parseInt(e.target.value) || undefined)}
                          placeholder="Optional"
                          min="0"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Fee for assignment contracts
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          id="jvAvailable"
                          checked={editData.jvAvailable || false}
                          onCheckedChange={(checked) => handleFieldChange('jvAvailable', checked)}
                        />
                        <Label htmlFor="jvAvailable">JV Partnership Available</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Operating Expenses (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="propertyTaxes">Property Taxes (Annual)</Label>
                        <Input
                          id="propertyTaxes"
                          type="number"
                          value={editData.propertyTaxes || ''}
                          onChange={(e) => handleFieldChange('propertyTaxes', parseInt(e.target.value) || undefined)}
                          placeholder="Optional"
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="insurance">Insurance (Annual)</Label>
                        <Input
                          id="insurance"
                          type="number"
                          value={editData.insurance || ''}
                          onChange={(e) => handleFieldChange('insurance', parseInt(e.target.value) || undefined)}
                          placeholder="Optional"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="utilities">Utilities (Monthly)</Label>
                        <Input
                          id="utilities"
                          type="number"
                          value={editData.utilities || ''}
                          onChange={(e) => handleFieldChange('utilities', parseInt(e.target.value) || undefined)}
                          placeholder="If owner pays"
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hoaFees">HOA Fees (Monthly)</Label>
                        <Input
                          id="hoaFees"
                          type="number"
                          value={editData.hoaFees || ''}
                          onChange={(e) => handleFieldChange('hoaFees', parseInt(e.target.value) || undefined)}
                          placeholder="Optional"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Media Section */}
            {activeSection === 'media' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5" />
                    <span>Media</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Property Images</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Drag and drop images or click to upload</p>
                      <Button variant="outline" size="sm">
                        Choose Files
                      </Button>
                    </div>
                    
                    {editData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {editData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Property image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => {
                                const newImages = editData.images.filter((_, i) => i !== index);
                                handleFieldChange('images', newImages);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            {index === 0 && (
                              <Badge className="absolute bottom-2 left-2 bg-[#135341] text-white">
                                Primary
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="videoUrl">Video Walkthrough URL</Label>
                    <Input
                      id="videoUrl"
                      value={editData.videoUrl || ''}
                      onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                      placeholder="YouTube, Vimeo, or cloud storage link"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Optional: Add a video tour or walkthrough
                    </p>
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