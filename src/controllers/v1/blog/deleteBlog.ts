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
import { userRepository } from '@/repository/userRepository/userRepository'
import { blogRepository } from '@/repository/blogRepository/blogreposiroty'
import blogService from '@/services/blog.service'
/**
 * Purify the blog content
 */


type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status' | 'author' >

const deleteBlog = catchAsync(async(req: Request, res: Response) => {
            const userId = req.userId as string
            const blogId = req.params.blogId

            await blogService.deleteBlog(userId, blogId)

            res.sendStatus(204)
        })

export default deleteBlog