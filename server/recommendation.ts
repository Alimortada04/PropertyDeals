import { Property } from "@shared/schema";

interface PropertyWithScore extends Property {
  score: number;
}

interface RecommendationOptions {
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  propertyTypes?: string[];
  preferredFeatures?: string[];
  maxResults?: number;
}

export class RecommendationEngine {
  private properties: Property[];

  constructor(properties: Property[]) {
    this.properties = properties;
  }

  /**
   * Get recommendations based on location and other criteria
   */
  getRecommendations(options: RecommendationOptions): Property[] {
    const {
      location,
      priceRange,
      propertyTypes,
      preferredFeatures,
      maxResults = 5
    } = options;

    // If no location specified, return random properties
    if (!location) {
      return this.getRandomProperties(maxResults);
    }

    // Score all properties based on criteria match
    const scoredProperties: PropertyWithScore[] = this.properties.map(property => {
      let score = 0;

      // Location match (city, state or zip)
      if (location) {
        const locationLower = location.toLowerCase();
        if (
          property.city?.toLowerCase().includes(locationLower) ||
          property.state?.toLowerCase().includes(locationLower) ||
          property.zipCode?.toLowerCase().includes(locationLower) ||
          property.address?.toLowerCase().includes(locationLower)
        ) {
          score += 50; // High score for location match
        } else if (this.isNearbyZipCode(property.zipCode, location)) {
          score += 30; // Medium score for nearby locations
        }
      }

      // Price range match
      if (priceRange && property.price) {
        if (property.price >= priceRange.min && property.price <= priceRange.max) {
          score += 20;
        } else {
          // Still give some points for properties close to the price range
          const priceDiff = Math.min(
            Math.abs(property.price - priceRange.min),
            Math.abs(property.price - priceRange.max)
          );
          const pricePercentDiff = priceDiff / ((priceRange.max - priceRange.min) / 2);
          
          if (pricePercentDiff < 0.2) {
            score += 10; // Close to price range
          } else if (pricePercentDiff < 0.5) {
            score += 5; // Somewhat close to price range
          }
        }
      }

      // Property type match
      if (propertyTypes && propertyTypes.length > 0 && property.propertyType) {
        if (propertyTypes.includes(property.propertyType)) {
          score += 15;
        }
      }

      // Feature match
      if (preferredFeatures && preferredFeatures.length > 0 && property.features) {
        const featureMatches = preferredFeatures.filter(feature => 
          property.features?.includes(feature)
        ).length;
        
        score += featureMatches * 5; // 5 points per matching feature
      }

      // Give slight boost to newer properties (assuming createdAt is a date string)
      if (property.createdAt) {
        const createdDate = new Date(property.createdAt);
        const now = new Date();
        const daysOld = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysOld < 30) {
          score += 5; // Slight boost for newer properties
        }
      }

      return {
        ...property,
        score
      };
    });

    // Sort by score (highest first)
    const sortedRecommendations = scoredProperties
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    // Return only the properties (without scores)
    return sortedRecommendations.map(({ score, ...property }) => property);
  }

  /**
   * Get random properties
   */
  private getRandomProperties(count: number): Property[] {
    const shuffled = [...this.properties]
      .sort(() => 0.5 - Math.random());
    
    return shuffled.slice(0, count);
  }

  /**
   * Simple proximity check for zip codes
   * In a real app, this would use a proper geo API
   */
  private isNearbyZipCode(propertyZip?: string, targetZip?: string): boolean {
    if (!propertyZip || !targetZip) return false;
    
    // If zip codes share the first 3 digits, they're likely in the same area
    // This is a very simplified approach for demonstration
    return propertyZip.substring(0, 3) === targetZip.substring(0, 3);
  }
}