/**
 * Node Modules
 */
import Comment, { IComment } from "@/models/comment"
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
import { validateRequired } from "@/utils/validateRequired"
import { ensureDocument } from "@/utils/ensureDocument"



const deleteComment =  catchAsync(async function (req:Request, res: Response): Promise<void>{
    const userId = req.userId                              // params = string interference
    const { commentId } = req.params                               // das auch string interference

    validateRequired(userId, 'userId', 401)
    validateRequired(commentId, 'commentId', 401)

    const comment = await Comment.findById(commentId).exec()   //wegen toString()
    const user = await User.findById(userId).select('role').lean().exec()

    ensureDocument(comment, 'Comment')
    ensureDocument(user, 'User')

    if(comment.userId.toString() !== userId?.toString() && user.role !== 'admin' ) {       //comment.userId = objectId   das muss fast immer zu string gemacht werden für JS
        logger.error('User tried to delete a comment without permission')
        const error = new Error('User tried to delete a comment without permission') as AppError;
        error.statusCode = 403;
        error.code = 'UserNotFound';
        throw error;
    }       

    await Comment.deleteOne({ _id: commentId })
    await Blog.findByIdAndUpdate(comment.blogId, {                      // comment.blogId = Realtion!!
        $inc: {likesCount: -1}
    })

    logger.info('Comment successfully deleted')
    res.status(201).json({
        commentId
    })
    return
})

export default deleteComment