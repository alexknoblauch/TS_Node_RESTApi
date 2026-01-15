/**
 * Node Modules
 */
import Comment from "@/models/comment"
import User from "@/models/user"
import Blog from "@/models/blog"

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
import { commentRepository } from "@/repository/commentRepository/commentRepository"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"



const deleteComment = (async function (userId: string, commentId: string): Promise<void>{

    const comment = await commentRepository.find({_id: commentId}) as any        //wegen toString()
    const user = await User.findById(userId).select('role').lean().exec()

    if(!comment){
        logger.error('Comment not found')
        const error = new Error('Comment not found') as AppError;
        error.statusCode = 404;
        error.code = 'CommentNotFound';
        throw error;
    }

    if(!user){
        logger.error('User not found')
        const error = new Error('User not found') as AppError;
        error.statusCode = 404;
        error.code = 'UserNotFound';
        throw error;
    }

    if(comment.userId.toString() !== userId && user.role !== 'admin' ) {
        logger.error('User tried to delete a comment without permission')
        const error = new Error('User tried to delete a comment without permission') as AppError;
        error.statusCode = 403;
        error.code = 'UserNotFound';
        throw error;
    }       

    await commentRepository.deleteById(commentId)
    await blogRepository.update(comment.blogId, {                      // comment.blogId = Realtion!!
        $inc: {likesCount: -1}
    })

    logger.info('Comment successfully deleted')
})

export default deleteComment