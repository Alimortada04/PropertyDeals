import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { ArrowLeft, Building, Camera, DollarSign, Truck, FileText, Save, Eye, Edit3, Calculator, Home, Calendar, Users, MapPin, Bed, Bath, Square, Clock, Tag, TrendingUp, PiggyBank, Wrench, Key, FileUp, Plus, Trash2, Upload, Video, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { SellerDashboardLayout } from '@/components/layout/seller-dashboard-layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize?: string;
  yearBuilt?: number;
  county?: string;
  parcelId?: string;
  listingPrice: number;
  purchasePrice?: number;
  arv?: number;
  estimatedRepairs?: number;
  monthlyRent?: number;
  condition: string;
  occupancyStatus: string;
  description?: string;
  images?: string[];
  videoUrl?: string;
  assignmentFee?: number;
  accessInstructions?: string;
  closingDate?: string;
  notes?: string;
}

interface RentalUnit {
  id: string;
  rent: number;
}

interface Expense {
  id: string;
  name: string;
  amount: number;
  frequency: 'Monthly' | 'Annual' | 'Quarterly';
}

interface Repair {
  id: string;
  name: string;
  cost: number;
  notes: string;
}

interface Partner {
  id: string;
  name: string;
}

export default function PropertyEditor() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeSection, setActiveSection] = useState<'information' | 'media' | 'finance' | 'logistics' | 'description'>('information');
  const [editData, setEditData] = useState<Partial<Property>>({});
  const [rentalUnits, setRentalUnits] = useState<RentalUnit[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [descriptionTone, setDescriptionTone] = useState('Professional');
  const [descriptionType, setDescriptionType] = useState('Marketing');

  const { data: property, isLoading } = useQuery({
    queryKey: ['/api/property-profiles', propertyId],
    enabled: !!propertyId,
  });

  const updatePropertyMutation = useMutation({
    mutationFn: (data: Partial<Property>) =>
      apiRequest(`/api/property-profiles/${propertyId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "Property Updated",
        description: "Your changes have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/property-profiles', propertyId] });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save property changes.",
        variant: "destructive",
      });
    },
  });

  const publishPropertyMutation = useMutation({
    mutationFn: () =>
      apiRequest(`/api/property-profiles/${propertyId}/publish`, {
        method: 'POST',
      }),
    onSuccess: () => {
      toast({
        title: "Property Published",
        description: "Your listing is now live!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/property-profiles', propertyId] });
    },
    onError: (error: any) => {
      toast({
        title: "Publish Failed",
        description: error.message || "Failed to publish property.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (property) {
      setEditData(property);
      setGeneratedDescription(property.description || '');
    }
  }, [property]);

  const handleFieldChange = (field: keyof Property, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const dataToSave = {
      ...editData,
      monthlyRent: calculateTotalRent(),
      assignmentFee: calculateAssignmentFee(),
    };
    updatePropertyMutation.mutate(dataToSave);
  };

  const addRentalUnit = () => {
    const newUnit: RentalUnit = {
      id: Date.now().toString(),
      rent: 0,
    };
    setRentalUnits(prev => [...prev, newUnit]);
  };

  const updateRentalUnit = (id: string, rent: number) => {
    setRentalUnits(prev => prev.map(unit => unit.id === id ? { ...unit, rent } : unit));
  };

  const removeRentalUnit = (id: string) => {
    setRentalUnits(prev => prev.filter(unit => unit.id !== id));
  };

  const calculateTotalRent = () => {
    return rentalUnits.reduce((total, unit) => total + unit.rent, 0);
  };

  const addExpense = () => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      frequency: 'Monthly',
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (id: string, field: keyof Expense, value: any) => {
    setExpenses(prev => prev.map(expense => expense.id === id ? { ...expense, [field]: value } : expense));
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const calculateMonthlyExpenses = () => {
    return expenses.reduce((total, expense) => {
      if (expense.frequency === 'Monthly') return total + expense.amount;
      if (expense.frequency === 'Annual') return total + (expense.amount / 12);
      if (expense.frequency === 'Quarterly') return total + (expense.amount / 3);
      return total;
    }, 0);
  };

  const calculateAnnualExpenses = () => {
    return expenses.reduce((total, expense) => {
      if (expense.frequency === 'Monthly') return total + (expense.amount * 12);
      if (expense.frequency === 'Annual') return total + expense.amount;
      if (expense.frequency === 'Quarterly') return total + (expense.amount * 4);
      return total;
    }, 0);
  };

  const addRepair = () => {
    const newRepair: Repair = {
      id: Date.now().toString(),
      name: '',
      cost: 0,
      notes: '',
    };
    setRepairs(prev => [...prev, newRepair]);
  };

  const updateRepair = (id: string, field: keyof Repair, value: any) => {
    setRepairs(prev => prev.map(repair => repair.id === id ? { ...repair, [field]: value } : repair));
  };

  const removeRepair = (id: string) => {
    setRepairs(prev => prev.filter(repair => repair.id !== id));
  };

  const calculateAssignmentFee = () => {
    if (editData.listingPrice && editData.purchasePrice) {
      return editData.listingPrice - editData.purchasePrice;
    }
    return 0;
  };

  const addPartner = () => {
    const newPartner: Partner = {
      id: Date.now().toString(),
      name: '',
    };
    setPartners(prev => [...prev, newPartner]);
  };

  const updatePartner = (id: string, name: string) => {
    setPartners(prev => prev.map(partner => partner.id === id ? { ...partner, name } : partner));
  };

  const removePartner = (id: string) => {
    setPartners(prev => prev.filter(partner => partner.id !== id));
  };

  const generateDescription = async () => {
    try {
      const response = await apiRequest('/api/ai/generate-description', {
        method: 'POST',
        body: JSON.stringify({
          property: editData,
          tone: descriptionTone,
          type: descriptionType,
        }),
      });
      setGeneratedDescription(response.description);
      handleFieldChange('description', response.description);
      toast({
        title: "Description Generated",
        description: "AI description has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate description. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <SellerDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading property...</div>
        </div>
      </SellerDashboardLayout>
    );
  }

  if (!property) {
    return (
      <SellerDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Property not found</div>
        </div>
      </SellerDashboardLayout>
    );
  }

  const sections = [
    { id: 'information', label: 'Property Information', icon: Building },
    { id: 'media', label: 'Media', icon: Camera },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'description', label: 'Property Description', icon: FileText },
  ] as const;

  return (
    <SellerDashboardLayout>
      <div className="p-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/sellerdash/1')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Property</h1>
              <p className="text-gray-600">{property.address}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              disabled={updatePropertyMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {updatePropertyMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            {property?.status === 'draft' && (
              <Button
                onClick={() => publishPropertyMutation.mutate()}
                disabled={publishPropertyMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                {publishPropertyMutation.isPending ? 'Publishing...' : 'Publish Listing'}
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{section.label}</span>
                <span className="md:hidden">{index + 1}</span>
              </button>
            );
          })}
        </div>

        <div className="max-w-4xl">
          {/* Step 1: Property Information */}
          {activeSection === 'information' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Step 1: Property Information</span>
                </CardTitle>
                <p className="text-sm text-gray-600">Enter the basic details about your property</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Address */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2 text-base font-medium">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Property Address
                    </Label>
                    <Input
                      id="address"
                      value={editData.address}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                      placeholder="e.g. 123 Main Street"
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter the full street address of the property
                    </p>
                  </div>

                  <Separator />

                  {/* Property Title */}
                  <div>
                    <Label htmlFor="title" className="flex items-center gap-2 text-base font-medium">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      Property Title
                    </Label>
                    <Input
                      id="title"
                      value={editData.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      placeholder="e.g. Colonial Single Family"
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      A descriptive title helps buyers identify your property
                    </p>
                  </div>

                  {/* Property Type */}
                  <div>
                    <Label htmlFor="propertyType" className="flex items-center gap-2 text-base font-medium">
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

                  <Separator />

                  {/* City / State / Zip */}
                  <div>
                    <Label className="text-base font-medium mb-2 block">Location Details</Label>
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
                  </div>

                  <Separator />

                  {/* Bedrooms / Bathrooms / Year Built */}
                  <div>
                    <Label className="text-base font-medium mb-2 block">Property Features</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="bedrooms" className="flex items-center gap-2">
                          <Bed className="h-4 w-4 text-muted-foreground" />
                          Bedrooms
                        </Label>
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
                        <Label htmlFor="bathrooms" className="flex items-center gap-2">
                          <Bath className="h-4 w-4 text-muted-foreground" />
                          Bathrooms
                        </Label>
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
                        <Label htmlFor="yearBuilt" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Year Built
                        </Label>
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
                  </div>

                  <Separator />

                  {/* Square Footage / Lot Size */}
                  <div>
                    <Label className="text-base font-medium mb-2 block">Size Information</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="squareFeet" className="flex items-center gap-2">
                          <Square className="h-4 w-4 text-muted-foreground" />
                          Square Footage
                        </Label>
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
                  </div>

                  <Separator />

                  {/* County / Parcel ID */}
                  <div>
                    <Label className="text-base font-medium mb-2 block">Additional Information (Optional)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="county">County</Label>
                        <Input
                          id="county"
                          value={editData.county || ''}
                          onChange={(e) => handleFieldChange('county', e.target.value)}
                          placeholder="e.g. Cook County"
                        />
                      </div>
                      <div>
                        <Label htmlFor="parcelId">Parcel ID / APN</Label>
                        <Input
                          id="parcelId"
                          value={editData.parcelId || ''}
                          onChange={(e) => handleFieldChange('parcelId', e.target.value)}
                          placeholder="e.g. 14-21-106-017-0000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Media */}
          {activeSection === 'media' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Step 2: Media</span>
                </CardTitle>
                <p className="text-sm text-gray-600">Upload images and videos to showcase your property</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Primary Image */}
                <div className="space-y-4">
                  <div>
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      Primary Image
                    </Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <Button variant="outline" className="hover:bg-gray-50">
                            Upload Primary Image
                          </Button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Gallery Images */}
                  <div>
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      Gallery Images
                    </Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <Button variant="outline" className="hover:bg-gray-50">
                            Upload Multiple Images
                          </Button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Select multiple images to create a gallery
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Video Walkthrough */}
                  <div>
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      Video Walkthrough
                    </Label>
                    <div className="mt-2 space-y-4">
                      <div>
                        <Label htmlFor="videoUrl">YouTube / Vimeo / Drive Link</Label>
                        <Input
                          id="videoUrl"
                          value={editData.videoUrl || ''}
                          onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                      <div className="text-center text-gray-500">or</div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <Video className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <Button variant="outline" className="hover:bg-gray-50">
                              Upload Video File
                            </Button>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            MP4, WEBM up to 100MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                <p className="text-sm text-gray-600">Set pricing and financial details for your property</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pricing */}
                <div className="space-y-4">
                  <div>
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      Pricing Information
                    </Label>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      </div>
                      <div>
                        <Label htmlFor="purchasePrice">Purchase Price</Label>
                        <Input
                          id="purchasePrice"
                          type="number"
                          value={editData.purchasePrice || ''}
                          onChange={(e) => handleFieldChange('purchasePrice', parseInt(e.target.value) || undefined)}
                          placeholder="e.g. 225000"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Rental Income */}
                  <div>
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <PiggyBank className="h-4 w-4 text-muted-foreground" />
                      Rental Income
                    </Label>
                    <div className="mt-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Total Monthly Rent</div>
                          <div className="text-2xl font-bold text-green-600">
                            ${calculateTotalRent().toLocaleString()}
                          </div>
                        </div>
                        <Button
                          onClick={addRentalUnit}
                          variant="outline"
                          className="hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Unit
                        </Button>
                      </div>
                      
                      {rentalUnits.map((unit) => (
                        <div key={unit.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <div className="flex-1">
                            <Label>Unit Rent (Monthly)</Label>
                            <Input
                              type="number"
                              value={unit.rent}
                              onChange={(e) => updateRentalUnit(unit.id, parseInt(e.target.value) || 0)}
                              placeholder="e.g. 1200"
                              min="0"
                            />
                          </div>
                          <Button
                            onClick={() => removeRentalUnit(unit.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Expenses */}
                  <div>
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <Calculator className="h-4 w-4 text-muted-foreground" />
                      Property Expenses
                    </Label>
                    <div className="mt-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-600">Monthly Total</div>
                            <div className="text-lg font-semibold">${calculateMonthlyExpenses().toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Annual Total</div>
                            <div className="text-lg font-semibold">${calculateAnnualExpenses().toLocaleString()}</div>
                          </div>
                        </div>
                        <Button
                          onClick={addExpense}
                          variant="outline"
                          className="hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Expense
                        </Button>
                      </div>

                      {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <div className="flex-1">
                            <Label>Expense Name</Label>
                            <Input
                              value={expense.name}
                              onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                              placeholder="e.g. Property Tax"
                            />
                          </div>
                          <div className="flex-1">
                            <Label>Amount</Label>
                            <Input
                              type="number"
                              value={expense.amount}
                              onChange={(e) => updateExpense(expense.id, 'amount', parseInt(e.target.value) || 0)}
                              placeholder="e.g. 500"
                              min="0"
                            />
                          </div>
                          <div className="flex-1">
                            <Label>Frequency</Label>
                            <Select
                              value={expense.frequency}
                              onValueChange={(value) => updateExpense(expense.id, 'frequency', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Annual">Annual</SelectItem>
                                <SelectItem value="Quarterly">Quarterly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            onClick={() => removeExpense(expense.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Repairs */}
                  <div>
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      Needed Repairs
                    </Label>
                    <div className="mt-2 space-y-4">
                      <div className="flex justify-end">
                        <Button
                          onClick={addRepair}
                          variant="outline"
                          className="hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Repair
                        </Button>
                      </div>

                      {repairs.map((repair) => (
                        <div key={repair.id} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1">
                              <Label>Repair Name</Label>
                              <Input
                                value={repair.name}
                                onChange={(e) => updateRepair(repair.id, 'name', e.target.value)}
                                placeholder="e.g. Kitchen Renovation"
                              />
                            </div>
                            <div className="w-32">
                              <Label>Cost</Label>
                              <Input
                                type="number"
                                value={repair.cost}
                                onChange={(e) => updateRepair(repair.id, 'cost', parseInt(e.target.value) || 0)}
                                placeholder="e.g. 5000"
                                min="0"
                              />
                            </div>
                            <Button
                              onClick={() => removeRepair(repair.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 mt-6"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div>
                            <Label>Notes/Description</Label>
                            <Textarea
                              value={repair.notes}
                              onChange={(e) => updateRepair(repair.id, 'notes', e.target.value)}
                              placeholder="Describe the repair needed..."
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Logistics */}
          {activeSection === 'logistics' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Step 4: Logistics</span>
                </CardTitle>
                <p className="text-sm text-gray-600">Manage property access, closing details, and partnerships</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Assignment Fee */}
                  <div>
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <Calculator className="h-4 w-4 text-muted-foreground" />
                      Assignment Fee
                    </Label>
                    <div className="mt-2">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Auto-calculated: Listing Price - Purchase Price</div>
                        <div className="text-2xl font-bold text-green-600">
                          ${calculateAssignmentFee().toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Access Type */}
                  <div>
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      Property Access Instructions
                    </Label>
                    <Textarea
                      value={editData.accessInstructions || ''}
                      onChange={(e) => handleFieldChange('accessInstructions', e.target.value)}
                      placeholder="How can buyers access the property? (e.g., Contact me 24 hours in advance, Key in lockbox code 1234, etc.)"
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <Separator />

                  {/* Closing Date */}
                  <div>
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Closing Date (Optional)
                    </Label>
                    <Input
                      type="date"
                      value={editData.closingDate || ''}
                      onChange={(e) => handleFieldChange('closingDate', e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <Separator />

                  {/* Purchase Agreement Upload */}
                  <div>
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <FileUp className="h-4 w-4 text-muted-foreground" />
                      Purchase Agreement
                    </Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <Button variant="outline" className="hover:bg-gray-50">
                            Upload Purchase Agreement
                          </Button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          PDF, DOC, DOCX up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Partners */}
                  <div>
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Deal Partners
                    </Label>
                    <div className="mt-2 space-y-4">
                      <div className="flex justify-end">
                        <Button
                          onClick={addPartner}
                          variant="outline"
                          className="hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Partner
                        </Button>
                      </div>

                      {partners.map((partner) => (
                        <div key={partner.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <div className="flex-1">
                            <Label>Partner Name</Label>
                            <Input
                              value={partner.name}
                              onChange={(e) => updatePartner(partner.id, e.target.value)}
                              placeholder="e.g. John Smith"
                            />
                          </div>
                          <Button
                            onClick={() => removePartner(partner.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 mt-6"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Notes */}
                  <div>
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Additional Notes
                    </Label>
                    <Textarea
                      value={editData.notes || ''}
                      onChange={(e) => handleFieldChange('notes', e.target.value)}
                      placeholder="Special conditions, instructions for buyers, or other important details..."
                      rows={4}
                      className="mt-2"
                    />
                  </div>
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
                <p className="text-sm text-gray-600">Generate an engaging description for your property</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* AI Description Generator */}
                  <div>
                    <Label className="flex items-center gap-2 text-base font-medium">
                      <Edit3 className="h-4 w-4 text-muted-foreground" />
                      AI Description Generator
                    </Label>
                    <div className="mt-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tone">Tone</Label>
                          <Select value={descriptionTone} onValueChange={setDescriptionTone}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Professional">Professional</SelectItem>
                              <SelectItem value="Casual">Casual</SelectItem>
                              <SelectItem value="Luxury">Luxury</SelectItem>
                              <SelectItem value="Investment">Investment-focused</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Select value={descriptionType} onValueChange={setDescriptionType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Technical">Technical</SelectItem>
                              <SelectItem value="Investment">Investment Analysis</SelectItem>
                              <SelectItem value="Detailed">Detailed Features</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button
                        onClick={generateDescription}
                        variant="outline"
                        className="w-full hover:bg-gray-50"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Regenerate Description
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Generated Description */}
                  <div>
                    <Label htmlFor="description" className="text-base font-medium">
                      Property Description
                    </Label>
                    <Textarea
                      id="description"
                      value={generatedDescription}
                      onChange={(e) => {
                        setGeneratedDescription(e.target.value);
                        handleFieldChange('description', e.target.value);
                      }}
                      placeholder="Enter or generate a description for your property..."
                      rows={8}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This description will be displayed to potential buyers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SellerDashboardLayout>
  );
}