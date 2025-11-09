import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/helpers/cloudinaryUpload";
import { StatusCodes } from "http-status-codes";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "portfolio";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const result = await uploadToCloudinary(file, folder);

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload file" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
