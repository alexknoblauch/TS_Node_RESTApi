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
import type { IBanner, IBlog } from '@/models/blog'
import type { AppError } from '@/middleware/errorHandler'
import { userRepository } from '@/repository/userRepository/userRepository'
import { blogRepository } from '@/repository/blogRepository/blogreposiroty'
/**
 * Purify the blog content
 */


type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status' >>

const createBlog = (async function(userId: string, blogId: string, title: string, content: string, banner: IBanner, status: 'draft' | 'publicated'): Promise<IBlog>{

    const user = await userRepository.findById(userId)
    const blog = await blogRepository.findById(blogId)

    if(!blog){
        const error = new Error('No blog found with this ID') as AppError;
        error.statusCode = 404;
        error.code = 'BlogNotFound';
        throw error;
    }

    if(blog.author !== userId && user?.role !== 'admin'){
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

    return blog
})

export default createBlog