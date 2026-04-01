import { createClient } from "@/lib/supabase/client";

export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createClient();
  // Nombre único para evitar colisiones
  const ext = file.name.split(".").pop();
  const filename = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("Pandor-img")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(error.message);

  // Obtenemos la URL pública
  const { data } = supabase.storage.from("Pandor-img").getPublicUrl(filename);

  return data.publicUrl;
}