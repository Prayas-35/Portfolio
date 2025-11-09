import cloudinary from "@/lib/cloudinary";

export async function uploadToCloudinary(
  file: File,
  folder: string = "portfolio"
): Promise<{ url: string; publicId: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folder,
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              });
            }
          }
        )
        .end(buffer);
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
}
