import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

//Set path in ES module
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

//Set path to .env in case of using this module in other functions at differen levels
dotenv.config({ path: path.join(__dirname, ".env") });

// Configuration
export const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_cloud_name,
  api_key: process.env.CLOUDINARY_api_key,
  api_secret: process.env.CLOUDINARY_api_secret, // Click 'View API Keys' above to copy your API secret
});

export const cloudinaryStorageObject = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Camp",
    format: async (req, res) => "png",
    public_id: (req, file) => "computed-filename-using-request",
  },
});

// const iploadResult = async ()=>  {
//   // Upload an image
//   const uploadResult = await cloudinary.uploader
//     .upload(
//       "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
//       {
//         public_id: "shoes",
//       }
//     )
//     .catch((error) => {
//       console.log(error);
//     });

//   console.log(uploadResult);

//   // Optimize delivery by resizing and applying auto-format and auto-quality
//   const optimizeUrl = cloudinary.url("shoes", {
//     fetch_format: "auto",
//     quality: "auto",
//   });

//   console.log(optimizeUrl);

//   // Transform the image: auto-crop to square aspect_ratio
//   const autoCropUrl = cloudinary.url("shoes", {
//     crop: "auto",
//     gravity: "auto",
//     width: 500,
//     height: 500,
//   });

//   console.log(autoCropUrl);
// };
