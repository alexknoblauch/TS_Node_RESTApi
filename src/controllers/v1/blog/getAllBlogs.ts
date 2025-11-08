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

interface QueryType {
  status?: 'published' | 'draft';
}


const getAllBlogs = catchAsync(async function(req: Request, res: Response): Promise<void>{
    const limit = Number(req.query.limit as string) || config.defaultResLimit
    const skip = Number(req.query.offset as string) || config.defaultOffset
    const userId = req.userId
    const query: QueryType = {} 

    
    const user = await User.findById(userId).select('role').lean().exec()
    if(!user) {
        const error = new Error('User not found for role settnigs') as AppError
        error.statusCode = 404
        error.code = 'ApiError'
        throw error
    } 
    if(user.role === 'user'){
        query.status = 'published'
    }

    
    const total = await Blog.countDocuments(query) 
    const data = await Blog.find(query)
    .select('-banner.publicId -__v')
    .populate('author', '-createdAt -updatedAt -__v')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 })
    .lean()
    .exec()

    if(!data || data.length === 0){
        const error = new Error('No Blogs found') as AppError
        error.statusCode = 404
        error.code = 'ApiError'
        throw error
    }

    res.status(200).json({
        code: 'ApiSuccess',
        message: 'Blogs successfully retrieved',
        blogs: data
    })
    logger.info('Blogs successfulls retreived')
})

export default getAllBlogs