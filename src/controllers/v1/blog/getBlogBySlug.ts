/**
 * Node Modules
 */

/**
 * Custom Models
 */
import logger from "@/lib/winston";
import { AppError } from "@/middleware/errorHandler";

/**
 * Models
 */
import Blog from "@/models/blog";
import catchAsync from "@/utils/catchAsync";
import config  from '@/config/index'
import User from "@/models/user";

/**
 * Types
 */
import type { Request, Response } from 'express'
import blog from "@/models/blog";



const getBlogsByUser = catchAsync(async function(req: Request, res: Response): Promise<void>{

    const userId = req.userId
    const slug = req.params.slug             // /:slug


    
    const user = await User.findById(userId).select('role').lean().exec()
    if(!user) { 
        const error = new Error('User not found for role settnigs') as AppError
        error.statusCode = 404                                                  //Rolle vergeben
        error.code = 'ApiError'
        throw error
    } 
    
    
    const data = await Blog.findOne({slug})
    .select('-banner.publicId -__v')
    .populate('author', '-createdAt -updatedAt -__v')
    .lean()
    .exec()
    
    if(user.role === 'user'&& data?.status === 'draft'){

        logger.warn('A User tried to access Draft Blog')
        throw new Error('User can not access Draft Blog')
    }
    

    if(!data){
        const error = new Error('No Blogs found for slug') as AppError
        error.statusCode = 404
        error.code = 'ApiError'
        throw error
    }

    res.status(200).json({
        code: 'ApiSuccess',
        message: 'Blog for slug successfully retrieved',
        blogs: data
    })
    logger.info('Blogs for slug successfulls retreived')
})

export default getBlogsByUser