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
import { validateRequired } from "@/utils/validateRequired"

type CommentData = Pick <IComment, 'comment'>                   //PICK TYPE

const commentBlog =  catchAsync(async function (req:Request, res: Response): Promise<void>{
    const userId = req.userId                                   // params = string interference
    const { blogId } = req.params                               // das auch string interference
    const { comment } = req.body as CommentData                 // Wichtig Typisieren!
 

    validateRequired(userId, 'userId', 404)
    validateRequired(blogId, 'BlogId', 404)
    validateRequired(comment, 'Comment', 404)


    const blog = await Blog.findById(blogId).lean().exec()

    if(!blog){
        logger.error('Blog not found')
        const error = new Error('Blog not found') as AppError;
        error.statusCode = 404;
        error.code = 'BlogNotFound';
        throw error;
    }

    const cleanComment = xss(comment)

    await Comment.create({ 
        userId: new Types.ObjectId(userId),                    //string to OObjectId machen!!
        blogId: new Types.ObjectId(blogId),                    //string to OObjectId machen!!
        comment })
    logger.info('Comment successfully created')
    res.status(201).json({
        blogId,                     
        userId,                     
        cleanComment
    })
    return
})

export default commentBlog