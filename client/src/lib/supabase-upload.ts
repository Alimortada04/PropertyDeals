import { supabase } from "@/lib/supabase";

export const uploadFileToSupabase = async (file: File, path: string): Promise<string | null> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("property-images")
    .upload(filePath, file);

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from("property-images")
    .getPublicUrl(filePath);

  return publicUrl;
};