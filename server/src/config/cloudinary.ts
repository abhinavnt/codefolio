import { v2 as cloudinary } from "cloudinary";


import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath: string) => {
    return await cloudinary.uploader.upload(filePath, {
      folder: "profile_images",
    });
  };

export default cloudinary;