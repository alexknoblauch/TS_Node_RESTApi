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
import type { BlogData, IBanner, IBlog } from '@/models/blog'
import type { AppError } from '@/middleware/errorHandler'
import { blogRepository } from '@/repository/blogRepository/blogreposiroty'
import { Request, Response } from 'express'
import blogService from '@/services/blog.service'


const createBlog = catchAsync(async(req: Request, res: Response) => {
    const { title, content, banner, status } = req.body as BlogData
    const userId = req.userId as string

    const credentials = {author: userId, title, content, banner, status}

    const user = await blogService.createBlog(credentials) 
    
    res.status(200).json({
        message: 'user successfully created',
        success: true,
        user
    })

})  

export default createBlog