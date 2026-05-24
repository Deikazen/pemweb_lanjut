import { supabase } from "../../config/supabaseClient.js";

/**
 * Uploads a base64 image string to Supabase Storage bucket 'media-produk'
 * @param {string} base64String - The base64 data url (e.g. data:image/png;base64,iVBOR...)
 * @param {string} pathPrefix - Prefix for the filename (e.g. 'items', 'settings')
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadBase64ToSupabase = async (base64String, pathPrefix) => {
  if (!base64String || !base64String.startsWith('data:image')) {
    // If it's already a URL or not a base64 image, just return it as is
    return base64String;
  }

  try {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Format Base64 tidak valid.");
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Get extension from mime type (e.g., image/jpeg -> jpg)
    let extension = mimeType.split('/')[1] || 'jpg';
    if (extension === 'jpeg') extension = 'jpg';
    if (extension.includes('+')) extension = extension.split('+')[0];

    // Create unique filename
    const fileName = `${pathPrefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}.${extension}`;

    // Upload to Supabase Storage bucket named 'media-produk'
    const { data, error } = await supabase.storage
      .from('media-produk')
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: true
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      throw error;
    }

    // Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from('media-produk')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;

  } catch (err) {
    console.error("Error uploading image to bucket:", err);
    throw err;
  }
};
