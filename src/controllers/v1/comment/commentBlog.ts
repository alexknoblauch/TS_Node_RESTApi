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
import { Types } from "mongoose"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { commentRepository } from "@/repository/commentRepository/commentRepository"

const commentBlog =  (async function (userId: string, blogId: string, comment: string): Promise<IComment>{

    const blog = await blogRepository.findById(blogId)

    if(!blog){
        logger.error('Blog not found')
        const error = new Error('Blog not found') as AppError;
        error.statusCode = 404;
        error.code = 'BlogNotFound';
        throw error;
    }

    const cleanComment = xss(comment)

    const createdComment = await commentRepository.create({ 
        userId: new Types.ObjectId(userId),                    //string to OObjectId machen!!
        blogId: new Types.ObjectId(blogId),                    //string to OObjectId machen!!
        comment: cleanComment 
    })
    
    logger.info('Comment successfully created')

    return createdComment
})

export default commentBlog