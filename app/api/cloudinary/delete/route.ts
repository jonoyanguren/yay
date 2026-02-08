import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

/**
 * DELETE /api/cloudinary/delete
 * Deletes an image from Cloudinary
 */
export async function DELETE(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn("Cloudinary credentials not configured for deletion");
      return NextResponse.json(
        { 
          success: true, 
          warning: "Image removed from database but not deleted from Cloudinary (credentials not configured)" 
        }
      );
    }

    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    const publicId = extractPublicId(imageUrl);
    
    if (!publicId) {
      return NextResponse.json(
        { error: "Invalid Cloudinary URL" },
        { status: 400 }
      );
    }

    // Generate timestamp for signature
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Create signature
    const crypto = require("crypto");
    const signature = crypto
      .createHash("sha256")
      .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    // Delete from Cloudinary
    const formData = new URLSearchParams();
    formData.append("public_id", publicId);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", apiKey);
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );

    const result = await response.json();

    if (result.result === "ok" || result.result === "not found") {
      return NextResponse.json({ success: true });
    }

    console.error("Cloudinary delete error:", result);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete from Cloudinary",
        details: result 
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: error.message || "Error deleting image" },
      { status: 500 }
    );
  }
}

/**
 * Extract public_id from Cloudinary URL
 * Examples:
 * - https://res.cloudinary.com/demo/image/upload/sample.jpg -> sample
 * - https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg -> folder/image
 */
function extractPublicId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    
    // Find the 'upload' segment
    const uploadIndex = pathParts.indexOf("upload");
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload/'
    const afterUpload = pathParts.slice(uploadIndex + 1);
    
    // Remove version if present (starts with v followed by numbers)
    if (afterUpload[0] && /^v\d+$/.test(afterUpload[0])) {
      afterUpload.shift();
    }
    
    // Join the remaining parts and remove file extension
    const publicIdWithExt = afterUpload.join("/");
    const publicId = publicIdWithExt.replace(/\.[^.]+$/, "");
    
    return publicId;
  } catch (error) {
    console.error("Error parsing Cloudinary URL:", error);
    return null;
  }
}
