/**
 * Node Modules
 */

import xss from 'xss'
/**
 * Custom Modules
*/
import catchAsync from "@/utils/catchAsync"
import logger from '@/lib/winston'
/**
 * Models
 */
import Blog from '@/models/blog'
import Like from '@/models/like'
/**
 * Middleware
*/
/**
 * Types
 */
import type { Request, Response } from 'express'
import type { IBlog } from '@/models/blog'
import type { AppError } from '@/middleware/errorHandler'
import { ensureDocument } from '@/utils/ensureDocument'
/**
 * Purify the blog content
 */

const likeBlog = catchAsync(async function(req: Request, res: Response): Promise<void>{

    const { userId }  = req.params
    const { blogId } = req.params

    const blog = await Blog.findById(blogId).select('likeCount').exec()

    ensureDocument(blog, 'Blog')
    
    const existingLike = await Like.findOne({userId, blogId})

    if(existingLike){
        logger.info('like already set', {
            blog,
            userId
        })
        const error = new Error('Like already given') as AppError;
        error.statusCode = 400;
        error.code = 'BadRequest';
        throw error; 
    }


    await Blog.findByIdAndUpdate(blog.id, {
        $inc: {likesCount: 1}
    })
    await Like.create({userId, blogId})

    logger.info('like successfully given', {
        blog,
        userId
    })

    res.status(200).json({
        blogLikes: blog.likesCount
    })
})

export default likeBlog