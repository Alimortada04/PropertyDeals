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
    title: data.title,
    address: data.address,
    city: data.city,
    state: data.state,
    zipCode: data.zipCode,
    propertyType: data.propertyType,
    listingPrice: data.listingPrice,
    condition: data.condition,
    occupancyStatus: data.occupancyStatus,
    status: 'draft',
    isPublic: false,
  };

  return await apiRequest('/api/property-profiles', {
    method: 'POST',
    body: JSON.stringify(propertyProfileData),
  });
}