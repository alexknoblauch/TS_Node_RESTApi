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
import { ensureDocument } from '@/utils/ensureDocument'
/**
 * Purify the blog content
 */


type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status' >>

const updateBlog = catchAsync(async function(req: Request, res: Response): Promise<void>{

    const {title, content, banner, status} = req.body as BlogData

    const userId = req.userId
    if (!userId) {
        return
    }

    const blogId = req.params.blogId
    if (!blogId) {
        return  
    }

    const user = await User.findById(userId).select('role').lean().exec()
    const blog = await Blog.findById(blogId)

    ensureDocument(user, 'User')
    ensureDocument(blog, 'Blog')

    if(blog.author.toString() !== userId.toString() && user?.role !== 'admin'){    //Type.objectId toString()! sosnt werden obejct ref nummern verglichen nicht deren inhalt
        logger.warn('User tried to update a Blog without haveing permission', {
            userId,
            blog
        })

        const error = new Error('Access denied') as AppError;
        error.statusCode = 403;
        error.code = 'AuthorizationError';
        throw error; 
    }
 
    if(title) blog.title = title

    if(content) {
        const cleanContent = xss(content)
        blog.content = cleanContent
    }

    if(banner) blog.banner = banner
    if(status) blog.status = status

    logger.info('Blog successfully updated')
    res.status(200).json({ blog })
})

export default updateBlog