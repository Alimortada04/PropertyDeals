import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads media and documents for property listings to the 'properties' bucket.
 */
export async function uploadPropertyFileToSupabase(
  file: File,
  type: "primary" | "gallery" | "video" | "agreements" | "repair-quotes",
  userId: string,
  propertyId: string,
  index?: number,
): Promise<string> {
  const bucket = "properties";
  let path = "";

  switch (type) {
    case "primary":
      path = `${userId}/${propertyId}/public-images/primary.jpg`;
      break;
    case "gallery":
      path = `${userId}/${propertyId}/public-images/gallery/${uuidv4()}.jpg`;
      break;
    case "video":
      path = `${userId}/${propertyId}/public-video/walkthrough.mp4`;
      break;
    case "agreements":
      path = `${userId}/${propertyId}/secure/purchase-agreement.pdf`;
      break;
    case "repair-quotes":
      path = `${userId}/${propertyId}/public-files/repair-quote-${index ?? 0}.pdf`;
      break;
    default:
      throw new Error(`Unsupported property file type: ${type}`);
  }

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  // ✅ Return the file path only — NOT the public URL
  return path;
}

/**
 * Uploads profile images or secure documents to the 'profiles' bucket.
 */
export async function uploadProfileFileToSupabase(
  file: File,
  type: "profile-photo" | "banner-image" | "proof-of-funds",
  userId: string,
): Promise<string> {
  const bucket = "profiles";
  let path = "";

  switch (type) {
    case "profile-photo":
      path = `${userId}/profile-photo.jpg`;
      break;

    case "banner-image":
      path = `${userId}/banner-image.jpg`;
      break;

    case "proof-of-funds":
      path = `${userId}/secure/proof-of-funds.pdf`;
      break;

    default:
      throw new Error(`Unsupported profile file type: ${type}`);
  }

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  if (type === "proof-of-funds") {
    return path; // private file
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl ?? "";
}

/**
 * Generates a signed URL for secure file access (e.g., agreements or proof-of-funds).
 */
export async function getSignedUrl(
  bucket: "properties" | "profiles",
  path: string,
  expiresIn: number = 300, // default: 5 minutes
): Promise<string | null> {
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error("Signed URL error:", error);
    return null;
  }

  return data?.signedUrl ?? null;
}

export function resolvePublicUrl(path: string | null): string | null {
  if (!path || typeof path !== "string") return null;

  // If it's already a full URL, return it as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Otherwise, resolve it as a file path
  const result = supabase.storage.from("properties").getPublicUrl(path);
  return result?.data?.publicUrl || null;
}
