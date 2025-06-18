import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';

// Upload functions for the new bucket structure
export async function uploadFileToSupabase(
  file: File,
  type: "primary" | "gallery" | "video" | "purchase-agreement" | "assignment-agreement" | "repair-quotes" | "profile-photo" | "banner-image",
  propertyId?: string,
  profileId?: string,
  index?: number
): Promise<string> {
  if (!file) {
    throw new Error("Missing file");
  }

  let bucket = "";
  let path = "";
  let isSecure = false;

  // Determine bucket and path based on file type
  switch (type) {
    case "primary":
      if (!propertyId) throw new Error("Property ID required for primary image");
      bucket = "properties";
      path = `${propertyId}/public-images/primary.${file.name.split(".").pop()}`;
      break;
    case "gallery":
      if (!propertyId) throw new Error("Property ID required for gallery image");
      bucket = "properties";
      const galleryId = uuidv4();
      path = `${propertyId}/public-images/gallery/${galleryId}.${file.name.split(".").pop()}`;
      break;
    case "video":
      if (!propertyId) throw new Error("Property ID required for video");
      bucket = "properties";
      path = `${propertyId}/public-video/walkthrough.${file.name.split(".").pop()}`;
      break;
    case "purchase-agreement":
      if (!propertyId) throw new Error("Property ID required for purchase agreement");
      bucket = "properties";
      path = `${propertyId}/secure/purchase-agreement.${file.name.split(".").pop()}`;
      isSecure = true;
      break;
    case "assignment-agreement":
      if (!propertyId) throw new Error("Property ID required for assignment agreement");
      bucket = "properties";
      path = `${propertyId}/secure/assignment-agreement.${file.name.split(".").pop()}`;
      isSecure = true;
      break;
    case "repair-quotes":
      if (!propertyId) throw new Error("Property ID required for repair quote");
      bucket = "properties";
      path = `${propertyId}/public-files/repair-quote-${index ?? 0}.${file.name.split(".").pop()}`;
      break;
    case "profile-photo":
      if (!profileId) throw new Error("Profile ID required for profile photo");
      bucket = "profiles";
      path = `${profileId}/profile-photo.${file.name.split(".").pop()}`;
      break;
    case "banner-image":
      if (!profileId) throw new Error("Profile ID required for banner image");
      bucket = "profiles";
      path = `${profileId}/banner-image.${file.name.split(".").pop()}`;
      break;
    default:
      throw new Error("Unsupported upload type");
  }

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  // Return public URL for public files, path for secure files
  if (!isSecure) {
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return urlData?.publicUrl || "";
  } else {
    return path; // Save file path for signed access later
  }
}

export async function getSignedUrl(
  path: string,
  bucket: "properties" | "profiles" = "properties",
  expiresIn: number = 60 * 5 // 5 minutes
): Promise<string | null> {
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error("Signed URL error:", error);
    return null;
  }

  return data?.signedUrl || null;
}

export async function getPublicUrl(
  path: string,
  bucket: "properties" | "profiles" = "properties"
): Promise<string | null> {
  if (!path) return null;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || null;
}

// Helper functions for specific file types
export async function uploadPropertyImage(
  file: File,
  propertyId: string,
  type: "primary" | "gallery"
): Promise<string> {
  return uploadFileToSupabase(file, type, propertyId);
}

export async function uploadPropertyVideo(
  file: File,
  propertyId: string
): Promise<string> {
  return uploadFileToSupabase(file, "video", propertyId);
}

export async function uploadPropertyAgreement(
  file: File,
  propertyId: string,
  type: "purchase-agreement" | "assignment-agreement"
): Promise<string> {
  return uploadFileToSupabase(file, type, propertyId);
}

export async function uploadRepairQuote(
  file: File,
  propertyId: string,
  index: number
): Promise<string> {
  return uploadFileToSupabase(file, "repair-quotes", propertyId, undefined, index);
}

export async function uploadProfileImage(
  file: File,
  profileId: string,
  type: "profile-photo" | "banner-image"
): Promise<string> {
  return uploadFileToSupabase(file, type, undefined, profileId);
}

// Functions to get media URLs based on new bucket structure
export function getPropertyImageUrl(propertyId: string, type: "primary" = "primary"): string {
  if (type === "primary") {
    const { data } = supabase.storage
      .from("properties")
      .getPublicUrl(`${propertyId}/public-images/primary.jpg`);
    return data?.publicUrl || "";
  }
  return "";
}

export function getPropertyGalleryUrls(propertyId: string, imageIds: string[]): string[] {
  return imageIds.map(imageId => {
    const { data } = supabase.storage
      .from("properties")
      .getPublicUrl(`${propertyId}/public-images/gallery/${imageId}.jpg`);
    return data?.publicUrl || "";
  }).filter(Boolean);
}

export function getPropertyVideoUrl(propertyId: string): string {
  const { data } = supabase.storage
    .from("properties")
    .getPublicUrl(`${propertyId}/public-video/walkthrough.mp4`);
  return data?.publicUrl || "";
}

export function getProfileImageUrl(profileId: string, type: "profile-photo" | "banner-image" = "profile-photo"): string {
  const { data } = supabase.storage
    .from("profiles")
    .getPublicUrl(`${profileId}/${type}.jpg`);
  return data?.publicUrl || "";
}

// Function to handle legacy image URLs and convert them to new structure
export function convertLegacyImageUrl(url: string, propertyId: string): string {
  if (!url || url.includes("/properties/")) {
    // Already using new structure
    return url;
  }
  
  // Convert legacy URLs to new structure
  if (url.includes("property-images")) {
    // This is a legacy URL, construct new URL
    return getPropertyImageUrl(propertyId);
  }
  
  return url;
}

// Avatar URL generator for profiles
export function generateAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=135341&color=ffffff`;
}