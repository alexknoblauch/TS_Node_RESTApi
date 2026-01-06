/**
 * Node Modules
 */

import xss from 'xss'
/**
 * Custom Modules
*/
import catchAsync from "@/utils/catchAsync"
import logger from '@/lib/winston'
import { ensureDocument } from '@/utils/ensureDocument'
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

    
    ensureDocument(newEntry, 'New Blog')

    logger.info('New Blog entry creted')
    

    res.status(201).json({
        code: 'BlogCreated',
        message: 'Successfully new Blog created',
        newEntry
    })
})

export default createBlog