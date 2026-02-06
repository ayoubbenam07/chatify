import dotenv from "dotenv"
import {v2 as cloudinary} from "cloudinary"

dotenv.config()

const {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = process.env

if(!CLOUDINARY_API_SECRET || !CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY)
    throw new Error("Cloudinary configuration is missing")

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})

export default cloudinary;