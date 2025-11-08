/**
 * Custom Modules
 */
import uploadToCloudinary from "@/lib/cloudinary";
import logger from "@/lib/winston";
import { AppError } from "./errorHandler"; 

/**
 * Models
 */
import Blog from "@/models/blog";
import catchAsync from "@/utils/catchAsync";

/**
 * Types
 */
import type { Request, Response, NextFunction } from "express";

/**
 * Constants
 */
const MAX_FILESIZE = 2 * 1024 * 1024 // 2MB


const uploadBlogBanner = (method: 'put' | 'post') => {
    return catchAsync(async function(req: Request, res: Response, next: NextFunction){
    if(method === 'put' && !req.file){
        next()
        return
    }

    if(!req.file){
        const error = new Error('Upload banner failed') as AppError;
        error.statusCode = 400;
        error.code = 'ValidationError';
        throw error;
    }

    if(req.file.size > MAX_FILESIZE){
        const error = new Error('Filsize must be less than 2MB') as AppError;
        error.statusCode = 413;
        error.code = 'ValidationError';
        throw error;
    }

    const { blogId } = req.params
    const blog = await Blog.findById(blogId).select('banner.publicId').exec()

    const data = await uploadToCloudinary(
        req.file.buffer,                                            //Multer !
       // Blog?.banner?.publicId.replace('blog-api', '')
    )

    if(!data){
        const error = new Error('Upload banner failed') as AppError;
        error.statusCode = 500;
        error.code = 'UploadBannerApiError';
        throw error;
    }

    const newBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height
    }

    logger.info('Blogbanner has been successfully uploaded', {
        banner: newBanner
    })

    req.body.banner = newBanner

    next()
    })
}

export default uploadBlogBanner