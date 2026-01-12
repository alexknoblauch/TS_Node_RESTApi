/**
 * Node Modules
 */
import Blog from "@/models/blog"
import Comment, { IComment } from "@/models/comment"
import xss from 'xss'

/**
 * Custom Modules
*/
import catchAsync from "@/utils/catchAsync"
import logger from "@/lib/winston"
/**
 * Middleware
 */
import { AppError } from "@/middleware/errorHandler"
/**
 * Types
 */
import { Request, Response } from "express"
import { blogRepository } from "@/repository/blogreposiroty"
import { commentRepository } from "@/repository/commentRepository"

const getCommentsByBlog =  (async function (blogId: string): Promise<IComment[]>{

    const blog = await blogRepository.findById(blogId)

    if(!blog ){
        logger.error('Blog not found')
        const error = new Error('Blog not found') as AppError;
        error.statusCode = 404;
        error.code = 'BlogNotFound';
        throw error;
    }

    const allComments = await commentRepository.find({_id: blogId})

 
    logger.info('Comments successfully retreaved')


    return allComments
})

export default getCommentsByBlog