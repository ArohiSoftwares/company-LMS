import { cloudinaryKeys } from "../../helpers/cloudinary.js";
import ApiResponse from "../../utils/ApiResponse.js";

const getCloudinaryKeys = async () => {

    const data = {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }

    return res 
    .status(200)
    .json(new ApiResponse(200, 'Cloudinary keys retrieved successfully', cloudinaryKeys));
}
 

export {
    getCloudinaryKeys
}