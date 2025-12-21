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
import { ensureDocument } from "@/utils/ensureDocument";
import { ensureArray } from "@/utils/ensureArray";
import blog from "@/models/blog";

interface QueryType {
  status?: 'published' | 'draft';
}


const getAllBlogs = catchAsync(async function(req: Request, res: Response): Promise<void>{
    let limit = Number(req.query.limit) || config.defaultResLimit;           // req.query hat Type: string | string[] | undefined
    let skip = Number(req.query.offset) || config.defaultOffset;
    
    if (limit < 1) limit = 1;
    if (skip < 0) skip = 0;

    const userId = req.userId
    const query: QueryType = {} 

    const user = await User.findById(userId).select('role').lean().exec()
    ensureDocument(user, 'user')
    
    if(user.role === 'user'){
        query.status = 'published'
    }
    
    const cacheKey = `blogs:${user.role}:limit:${limit}:skip:${skip}`

    const cache = `blogs:${limit}:${skip}:${user.role}`
    
    const data = await getOrSetRedis(cacheKey, async () => {
        const blogs = await Blog.find(query)
            .select('-banner.publicId -__v')
            .populate('author', '-createdAt -updatedAt -__v')
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 })
            .lean()
            .exec()

        ensureArray(blogs, 'blogs')

        return blogs
    })

    res.status(200).json({
        code: 'ApiSuccess',
        message: 'Blogs successfully retrieved',
        blogs: data
    })
    logger.info(`Blogs successfully retrieved ${data.length} blogs`)
})

export default getAllBlogs