/**
 * Node Modules
 */

import xss from 'xss'
/**
 * Custom Modules
*/
import catchAsync from "@/utils/async/catchAsync"
import logger from '@/lib/winston'
import { ensureDocument } from '@/utils/validation/ensureDocument'
/**
 * Models
 */
import Blog from '@/models/blog'

/**
 * Types
 */
import type { Request, Response } from 'express'
import { createBlogSchema } from '@/dto/blog/createBlog.schema'
import blogService from '@/services/blog.service'
import notFound from '@/errors/http/notFoundError'



const createBlog = catchAsync(async function(req: Request, res: Response): Promise<void>{
    const { title, content, banner, status } = createBlogSchema.parse(req.body)
    const userId = req.userId?.toString()
    if(!userId){
        return notFound(req, 'userId not found')
    }

    const cleanContent = xss(content)
    const newEntry = await blogService.createBlog({ title, content: cleanContent, banner, status, author: userId })

    
    ensureDocument(newEntry, 'New Blog')

    logger.info('New Blog entry creted')
    

    res.status(201).json({
        code: 'BlogCreated',
        message: 'Successfully new Blog created',
        newEntry
    })
})

export default createBlog