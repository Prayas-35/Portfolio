/**
 * Helper function to upload files and get their Cloudinary URLs
 */
export async function uploadFiles(files: File[], folder: string = "portfolio"): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload ${file.name}`);
    }

    const data = await response.json();
    return data.url;
  });

  return Promise.all(uploadPromises);
}

/**
 * Helper to create FormData from an object with files
 */
export function createFormDataWithFiles(
  data: Record<string, any>,
  fileFields: { key: string; files: File[] }[]
): FormData {
  const formData = new FormData();

  // Add regular fields
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === "object" && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  // Add file fields
  fileFields.forEach(({ key, files }) => {
    files.forEach((file) => {
      formData.append(key, file);
    });
  });

  return formData;
}
