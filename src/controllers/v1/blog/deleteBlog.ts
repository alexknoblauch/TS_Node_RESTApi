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
/**
 * Purify the blog content
 */


type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status' | 'author' >

const deleteBlog = catchAsync(async function(req: Request, res: Response): Promise<void>{

    const {title, content, banner, status} = req.body as BlogData
    const userId = req.userId
    const blogId = req.params.blogId

    const user = await User.findById(userId).select('role').lean().exec()
    const blog = await Blog.findById(blogId).select('author banner.puvlicId').lean().exec()

    if(!blog){
        const error = new Error(`No Blog found with id ${blogId}`) as AppError;
        error.statusCode = 400;
        error.code = 'BlogNotFound';
        throw error;
    }

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