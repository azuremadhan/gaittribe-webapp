import { mkdir, writeFile } from "fs/promises";
import path from "path";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function uploadEventImage(file: File | null | undefined) {
  if (!file || file.size === 0) return null;

  const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseBucket = process.env.SUPABASE_BUCKET;

  if (supabaseUrl && supabaseKey && supabaseBucket) {
    const objectPath = `events/${fileName}`;
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${supabaseBucket}/${objectPath}`;
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
        "x-upsert": "true",
        "Content-Type": file.type || "application/octet-stream",
      },
      body: buffer,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    return `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/${objectPath}`;
  }

  const outputDir = path.join(process.cwd(), "public", "uploads", "events");
  await mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, fileName);
  await writeFile(outputPath, buffer);

  return `/uploads/events/${fileName}`;
}
