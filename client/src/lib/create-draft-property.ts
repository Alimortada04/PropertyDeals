import { apiRequest } from '@/lib/queryClient';
import type { InsertPropertyProfile } from '@shared/schema';

export interface CreateDraftPropertyData {
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  listingPrice: number;
  condition: string;
  occupancyStatus: string;
}

export async function createDraftProperty(data: CreateDraftPropertyData): Promise<any> {
  const propertyProfileData: Partial<InsertPropertyProfile> = {
    name: data.title,
    address: data.address,
    city: data.city,
    state: data.state,
    zipCode: data.zipCode,
    propertyType: data.propertyType,
    listingPrice: data.listingPrice,
    status: 'draft',
    createdBy: 1, // Default seller ID for now
  };

  return await apiRequest('/api/property-profiles', 'POST', propertyProfileData);
}

// Simplified function for immediate draft creation with minimal data
export async function createMinimalDraft(sellerId: number): Promise<any> {
  try {
    const minimalDraftData = {
      sellerId,
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      propertyType: '',
      status: 'draft',
      bedrooms: null,
      bathrooms: null,
      sqft: null,
      listingPrice: null,
      purchasePrice: null,
      arv: null,
      description: '',
    };

    const response = await apiRequest('/api/property-profiles', 'POST', minimalDraftData);
    return response;
  } catch (error) {
    console.error('Failed to create minimal draft:', error);
    return null;
  }
}