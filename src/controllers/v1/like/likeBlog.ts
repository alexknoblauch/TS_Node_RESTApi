/**
 * Custom Modules
*/
import catchAsync from "@/utils/async/catchAsync"
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
import { ensureDocument } from '@/utils/validation/ensureDocument'
import httpConflictError from "@/errors/http/httpConflictError"
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
        logger.info('like already exists', {
            reason: 'LIKE_ALREADY_EXISTS',
            blog: blog?._id,
            userId,   
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            action: 'LIKE_ATTEMPT'
        })

        const error = httpConflictError(req, 'like already exists')      // CONFLICT 409
        throw error
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