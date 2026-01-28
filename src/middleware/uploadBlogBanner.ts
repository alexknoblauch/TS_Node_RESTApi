/**
 * Custom Modules
 */
import uploadToCloudinary from "@/lib/cloudinary";
import logger from "@/lib/winston";

/**
 * Models
 */
import Blog from "@/models/blog";
import catchAsync from "@/utils/catchAsync";

/**
 * Types
 */
import type { Request, Response, NextFunction } from "express";
import { ensureDocument } from "@/utils/ensureDocument";
import AppError from "@/utils/AppError";
import { notFound } from "@/utils/HTTP Error files/notFoundError";

/**
 * Constants
 */
const MAX_FILESIZE = 2 * 1024 * 1024 // 2MB


const uploadBlogBanner = (method: 'put' | 'post') => {
    return catchAsync(async function(req: Request, res: Response, next: NextFunction){
        const { blogId } = req.params
        const blog = await Blog.findById(blogId).select('banner.publicId').exec()
        ensureDocument(blog, 'Blog')

        if(method === 'put' && !req.file){
            next()
            return
        }

        if(!req.file){
            throw notFound(req, 'File not found')
        }

        if(req.file.size > MAX_FILESIZE){
            logger.info('File too big', {
            reason: 'FILE_SIZE_PROBLEM',   
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            action: 'UPLOAD_ATTEMPT'
            })
            throw new AppError('File too big', 409, 'Conflict'); 
        }


        const data = await uploadToCloudinary(
            req.file.buffer,                                            //Multer !
        // Blog?.banner?.publicId.replace('blog-api', '')
        )

        ensureDocument(data, 'File')

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