import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file to Cloudinary directly from the buffer
export const uploadFile = async (fileBuffer, fileName) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "pet_marketplace", public_id: fileName }, // Optionally set a custom public_id
        (error, result) => {
          if (error) {
            reject(error); // Reject the promise in case of an error
          } else {
            resolve(result); // Resolve the promise with the Cloudinary result
          }
        }
      );
      uploadStream.end(fileBuffer); // Send the file buffer to Cloudinary
    });
  } catch (error) {
    console.error("File Upload Error:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};
