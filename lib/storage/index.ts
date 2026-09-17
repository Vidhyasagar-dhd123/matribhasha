import fs from "node:fs/promises";
import path from "node:path";
import { Buffer } from "node:buffer";
import cloudinary from "@/lib/cloudinary";

export interface UploadResult {
  url: string;
  publicId: string;
  filename: string;
  provider: "local" | "cloudinary";
}

export interface StorageAdapter {
  upload(fileBuffer: Buffer, filename: string, folder?: string): Promise<UploadResult>;
  delete?(publicId: string): Promise<boolean>;
}

export class LocalStorageAdapter implements StorageAdapter {
  private baseDir: string;

  constructor(baseDir = path.join(process.cwd(), "public", "uploads")) {
    this.baseDir = baseDir;
  }

  async upload(fileBuffer: Buffer, filename: string, folder = "matribhasha"): Promise<UploadResult> {
    const cleanFolder = folder.replace(/[^a-zA-Z0-9_\-\/]/g, "");
    const targetDir = path.join(this.baseDir, cleanFolder);
    await fs.mkdir(targetDir, { recursive: true });

    const timestamp = Date.now();
    const safeFilename = `${timestamp}-${filename.replace(/[^a-zA-Z0-9_\.\-]/g, "_")}`;
    const filePath = path.join(targetDir, safeFilename);

    await fs.writeFile(filePath, fileBuffer);

    // Return public web URL
    const publicUrl = `/uploads/${cleanFolder}/${safeFilename}`;
    return {
      url: publicUrl,
      publicId: `${cleanFolder}/${safeFilename}`,
      filename: safeFilename,
      provider: "local",
    };
  }

  async delete(publicId: string): Promise<boolean> {
    try {
      const filePath = path.join(this.baseDir, publicId);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export class CloudinaryStorageAdapter implements StorageAdapter {
  async upload(fileBuffer: Buffer, filename: string, folder = "matribhasha"): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          public_id: `${Date.now()}-${path.parse(filename).name}`,
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload failed"));
            return;
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            filename: result.original_filename || filename,
            provider: "cloudinary",
          });
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  async delete(publicId: string): Promise<boolean> {
    try {
      const res = await cloudinary.uploader.destroy(publicId);
      return res.result === "ok";
    } catch {
      return false;
    }
  }
}

export function getStorageAdapter(): StorageAdapter {
  const driver = process.env.STORAGE_DRIVER?.toLowerCase();

  const hasCloudinary =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (driver === "cloudinary" && hasCloudinary) {
    return new CloudinaryStorageAdapter();
  }

  if (driver === "local" || !hasCloudinary) {
    return new LocalStorageAdapter();
  }

  return new CloudinaryStorageAdapter();
}
