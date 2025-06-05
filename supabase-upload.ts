import { supabase } from "@/lib/supabase";

export async function uploadFileToSupabase(
  file: File,
  type: "primary" | "gallery" | "video" | "agreements" | "repair-quotes",
  userId?: string,
  propertyId?: string,
  index?: number // for gallery or quote file indexing
): Promise<string> {
  if (!file || !userId || !propertyId) {
    throw new Error("Missing required upload metadata");
  }

  let bucket = "";
  let path = "";

  // Set destination based on file type
  switch (type) {
    case "primary":
      bucket = "property-images";
      path = `${userId}/${propertyId}/main.${file.name.split(".").pop()}`;
      break;
    case "gallery":
      bucket = "property-images";
      path = `${userId}/${propertyId}/gallery/image${index ?? 0}.${file.name.split(".").pop()}`;
      break;
    case "video":
      bucket = "property-images";
      path = `${userId}/${propertyId}/video.${file.name.split(".").pop()}`;
      break;
    case "agreements":
      bucket = "property-files";
      path = `${userId}/${propertyId}/agreement.${file.name.split(".").pop()}`;
      break;
    case "repair-quotes":
      bucket = "property-files";
      path = `${userId}/${propertyId}/repairs/quote_${index ?? 0}.${file.name.split(".").pop()}`;
      break;
    default:
      throw new Error("Unsupported upload type");
  }

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  if (bucket === "property-images") {
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return urlData?.publicUrl || "";
  } else {
    return path; // Save file path for signed access later
  }
}

import { supabase } from "@/lib/supabase";

export async function getSignedUrl(
  path: string,
  bucket: "property-files",
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
