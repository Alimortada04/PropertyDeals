import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { usePropertyProfile } from "@/hooks/usePropertyProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, CheckCircle, Eye } from "lucide-react";

export default function PropertyEditor() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [, setLocation] = useLocation();
  const { getProperty, updateProperty, publishProperty } = usePropertyProfile();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    property_type: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    listing_price: '',
    purchase_price: '',
    arv: '',
    description: '',
    notes: ''
  });

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    try {
      if (!propertyId) return;
      
      const data = await getProperty(parseInt(propertyId));
      setProperty(data);
      
      // Pre-fill form with existing data
      setFormData({
        title: data.title || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zip_code: data.zip_code || '',
        property_type: data.property_type || '',
        bedrooms: data.bedrooms?.toString() || '',
        bathrooms: data.bathrooms?.toString() || '',
        square_feet: data.square_feet?.toString() || '',
        listing_price: data.listing_price?.toString() || '',
        purchase_price: data.purchase_price?.toString() || '',
        arv: data.arv?.toString() || '',
        description: data.description || '',
        notes: data.notes || ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load property",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updates = {
        title: formData.title,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        property_type: formData.property_type,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
        listing_price: formData.listing_price ? parseInt(formData.listing_price) : null,
        purchase_price: formData.purchase_price ? parseInt(formData.purchase_price) : null,
        arv: formData.arv ? parseInt(formData.arv) : null,
        description: formData.description,
        notes: formData.notes
      };

      await updateProperty(parseInt(propertyId!), updates);
      
      toast({
        title: "Saved",
        description: "Property updated successfully"
      });
      
      // Reload property data
      loadProperty();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      
      // First save current changes
      await handleSave();
      
      // Then publish
      await publishProperty(parseInt(propertyId!));
      
      toast({
        title: "Published!",
        description: "Your property is now live and visible to buyers"
      });
      
      // Reload to show updated status
      loadProperty();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish property",
        variant: "destructive"
      });
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <Button onClick={() => setLocation('/sellerdash')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const isDraft = property.status === 'draft';

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setLocation('/sellerdash')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isDraft ? 'Complete Your Listing' : 'Edit Property'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={isDraft ? "secondary" : "default"}>
                {property.status}
              </Badge>
              {property.is_public && (
                <Badge variant="outline">Public</Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          
          {isDraft ? (
            <Button onClick={handlePublish} disabled={publishing}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {publishing ? 'Publishing...' : 'Publish Listing'}
            </Button>
          ) : (
            <Button onClick={() => setLocation(`/properties/${property.id}`)} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Live
            </Button>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Beautiful 3BR Home in Downtown"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Milwaukee"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="WI"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => handleInputChange('zip_code', e.target.value)}
                placeholder="53202"
              />
            </div>

            <div>
              <Label htmlFor="property_type">Property Type</Label>
              <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single-Family">Single-Family</SelectItem>
                  <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                  <SelectItem value="Condo">Condo</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  placeholder="3"
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  placeholder="2.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="square_feet">Square Feet</Label>
              <Input
                id="square_feet"
                type="number"
                value={formData.square_feet}
                onChange={(e) => handleInputChange('square_feet', e.target.value)}
                placeholder="1500"
              />
            </div>

            <div>
              <Label htmlFor="listing_price">Listing Price</Label>
              <Input
                id="listing_price"
                type="number"
                value={formData.listing_price}
                onChange={(e) => handleInputChange('listing_price', e.target.value)}
                placeholder="250000"
              />
            </div>

            <div>
              <Label htmlFor="purchase_price">Purchase Price</Label>
              <Input
                id="purchase_price"
                type="number"
                value={formData.purchase_price}
                onChange={(e) => handleInputChange('purchase_price', e.target.value)}
                placeholder="200000"
              />
            </div>

            <div>
              <Label htmlFor="arv">ARV (After Repair Value)</Label>
              <Input
                id="arv"
                type="number"
                value={formData.arv}
                onChange={(e) => handleInputChange('arv', e.target.value)}
                placeholder="300000"
              />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Description & Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Property Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the property, its features, condition, and potential..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="notes">Private Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Internal notes, repair details, seller contact info..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}