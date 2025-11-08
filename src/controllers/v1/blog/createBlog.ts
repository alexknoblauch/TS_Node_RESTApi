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
/**
 * Middleware
*/
/**
 * Types
 */
import type { Request, Response } from 'express'
import type { IBlog } from '@/models/blog'
import type { AppError } from '@/middleware/errorHandler'


type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status' >

const createBlog = catchAsync(async function(req: Request, res: Response): Promise<void>{

    const { title, content, banner, status } = req.body as BlogData
    const userId = req.userId

    const cleanContent = xss(content)
    const newEntry = await Blog.create({ title, content: cleanContent, banner, status, author: userId })

    
    if(newEntry == null){
        const error = new Error('create new Blog not worked') as AppError;
        error.statusCode = 400;
        error.code = 'BlogNotCreateds';
        throw error;
    }
    logger.info('New Blog entry creted')
    

    res.status(201).json({
        code: 'BlogCreated',
        message: 'Successfully new Blog created',
        newEntry
    })
})

export default createBlog