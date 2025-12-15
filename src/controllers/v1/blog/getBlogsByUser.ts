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
import getOrSetRedis from "@/utils/getOrSetRedis";

interface QueryType {
  status?: 'published' | 'draft';                   //Interface optional aber empfehelnswert
}


const getBlogsByUser = catchAsync(async function(req: Request, res: Response): Promise<void>{
    const limit = Number(req.query.limit as string) || config.defaultResLimit           // limit sort ect ist IMMER req.query
    const skip = Number(req.query.offset as string) || config.defaultOffset
    const currentId = req.userId
    const queryId = req.params.id             // user/:userId
    const query: QueryType = {} 


    
    const user = await User.findById(currentId).select('role').lean().exec()

    if(!user) { 
        const error = new Error('User not found for role settnigs') as AppError
        error.statusCode = 404                                                          //Rolle vergeben
        error.code = 'ApiError'
        throw error
    }

    if(user.role === 'user'){
        query.status = 'published'
    }

    const total = await Blog.countDocuments({author: queryId, ...query})  //spread Opterator nicht vergessen!!
    const cacheKey = `Blog-${queryId}:${user.role}:${limit}:${skip}` 

    const blog = await getOrSetRedis(cacheKey, async () => {
        const data = await Blog.find({author: queryId, ...query})
        .select('title slug content banner.url author viewsCount likesCount commentsCount status createdAt')
        .populate('author', 'name email avatar')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .lean()
        .exec()

        const author = data[0]?.author;

        if(!data || data.length === 0){
            const error = new Error('No Blogs found for user') as AppError
            error.statusCode = 404
            error.code = 'ApiError'
            throw error
        }
        
        return {data, author}                       // 2 Export (data & author)
        })


    res.status(200).json({
        code: 'ApiSuccess',
        message: 'Blogs of user successfully retrieved',
        blogs: blog.data,                          // 2 Exporte = blog.data
        author: blog.author                        // 2 Exporte = blog.author
    })
    logger.info('Blogs of user successfulls retreived')
})

export default getBlogsByUser