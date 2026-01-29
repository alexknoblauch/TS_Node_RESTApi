/**
 * Node Modules
 */

import xss from 'xss'
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
/**
 * Purify the blog content
 */

const unlikeBlog = catchAsync(async function(req: Request, res: Response): Promise<void>{

    const  userId  = req.params
    const { blogId } = req.params

    const blog = await Blog.findById(blogId).select('likeCount').exec()

    ensureDocument(blog, 'Blog')

    await Blog.findByIdAndUpdate(blog.id, {
        $inc: {likesCount: -1}
    })
    await Like.deleteOne({userId, blogId})

    logger.info('like successfully deleted', {
        blog,
        userId
    })

    res.status(200).json({
        blogLikes: blog.likesCount
    })
})

export default unlikeBlog