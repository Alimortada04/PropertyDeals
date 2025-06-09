import { useQuery } from '@tanstack/react-query';

export function useSellerProfile(sellerId: string | null) {
  return useQuery({
    queryKey: ['seller-profile', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const response = await fetch(`/api/seller-profile/${sellerId}`);
      if (!response.ok) throw new Error('Failed to fetch seller profile');
      return response.json();
    },
    enabled: !!sellerId,
  });
}

export function useSellerProperties(sellerId: string | null, currentPropertyId: string) {
  return useQuery({
    queryKey: ['seller-properties', sellerId, currentPropertyId],
    queryFn: async () => {
      if (!sellerId) return [];
      const response = await fetch(`/api/seller-properties/${sellerId}?exclude=${currentPropertyId}`);
      if (!response.ok) throw new Error('Failed to fetch seller properties');
      return response.json();
    },
    enabled: !!sellerId,
  });
}