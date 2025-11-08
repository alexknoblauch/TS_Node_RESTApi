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

const getCommentsByBlog =  catchAsync(async function (req:Request, res: Response): Promise<void>{
    const { blogId } = req.params                               

    const blog = await Blog.findById(blogId).lean().exec()

    if(!blog ){
        logger.error('Blog not found')
        const error = new Error('Blog not found') as AppError;
        error.statusCode = 404;
        error.code = 'BlogNotFound';
        throw error;
    }

    const allComments = await Comment.find({blogId}).sort({ createdAt: -1}).lean().exec()

 
    logger.info('Comments successfully retreaved')
    res.status(200).json({
        allComments
    })

    return
})

export default getCommentsByBlog