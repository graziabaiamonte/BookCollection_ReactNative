import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// basic runtime check for environment presence (no secrets printed)
try {
  const hasName = Boolean(process.env.CLOUDINARY_CLOUD_NAME);
  const hasKey = Boolean(process.env.CLOUDINARY_API_KEY);
  const hasSecret = Boolean(process.env.CLOUDINARY_API_SECRET);
  if (!hasName || !hasKey || !hasSecret) {
    console.warn("Cloudinary env missing:", { hasName, hasKey, hasSecret });
  }
} catch (_) {}

export default cloudinary;
