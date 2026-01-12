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
import type { IBanner, IBlog } from '@/models/blog'
import type { AppError } from '@/middleware/errorHandler'
import { blogRepository } from '@/repository/blogreposiroty'


const createBlog = (async function(userId: string, cleanContent:string, title: string, banner: IBanner, status: 'draft' | 'publicated'): Promise<IBlog>{
    const newEntry = await blogRepository.create({ title, content: cleanContent, banner, status, author: userId })

    if(newEntry == null){
        const error = new Error('create new Blog not worked') as AppError;
        error.statusCode = 400;
        error.code = 'BlogNotCreateds';
        throw error;
    }
    return newEntry

})

export default createBlog