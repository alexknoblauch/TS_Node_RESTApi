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
import User from '@/models/user'
/**
 * Middleware
*/
/**
 * Types
 */
import type { Request, Response } from 'express'
import type { IBlog } from '@/models/blog'
import type { AppError } from '@/middleware/errorHandler'
import { Types } from 'mongoose'
import { ensureDocument } from '@/utils/ensureDocument'
/**
 * Purify the blog content
 */



const deleteBlog = catchAsync(async function(req: Request, res: Response): Promise<void>{

    const userId = req.userId as Types.ObjectId
    const blogId = req.params.blogId as string

    const user = await User.findById(userId).select('role').lean().exec()
    const blog = await Blog.findById(blogId).select('author banner.puvlicId').lean().exec()

    ensureDocument(blog, 'blog')

    if(blog?.author !== userId && user?.role !== 'admin'){
        logger.warn('someone tried to delete blog without acceess',{
            blog,
            userId
        })

        const error = new Error(`Pessmissions for delte blog denies`) as AppError;
        error.statusCode = 400;
        error.code = 'AccessError';
        throw error;
    }

    //await cloudenary.delet(......)        //IMG nicht vergessen zu deleten
    await Blog.deleteOne(userId)
    logger.info('blog has been successfully deleted', {
        blog
    })
    res.sendStatus(204)
})

export default deleteBlog