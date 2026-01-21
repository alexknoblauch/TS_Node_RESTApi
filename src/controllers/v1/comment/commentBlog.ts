/**
 * Node Modules
 */
import Comment, { CommentData, IComment } from "@/models/comment"
import commentService from "@/services/comment.service"
import catchAsync from "@/utils/catchAsync"
<<<<<<< HEAD
import logger from "@/lib/winston"

/**
 * Middleware
 */
import { AppError } from "@/middleware/errorHandler"
=======

>>>>>>> tests
/**
 * Types
 */
import { Request, Response } from "express"
<<<<<<< HEAD
import { Types } from "mongoose"
import { validateRequired } from "@/utils/validateRequired"
import { ensureDocument } from "@/utils/ensureDocument"

type CommentData = Pick <IComment, 'comment'>                   //PICK TYPE
=======
>>>>>>> tests


const commentBlog =  catchAsync(async(req: Request, res: Response) => {
    const userId = req.userId                                   // params = string interference
    const { blogId } = req.params                               // das auch string interference
    
    if(!userId) {
        return res.status(401).json({
            code: 'Unauthorized',
            message: 'User not authenticated'
        })
    }    
                             
    const { comment } = req.body as CommentData                 // Wichtig Typisieren!
<<<<<<< HEAD
 

    validateRequired(userId, 'userId', 404)
    validateRequired(blogId, 'BlogId', 404)
    validateRequired(comment, 'Comment', 404)


    const blog = await Blog.findById(blogId).lean().exec()

    ensureDocument(blog, 'Blog')

    const cleanComment = xss(comment)

    await Comment.create({ 
        userId: new Types.ObjectId(userId),                    //string to OObjectId machen!!
        blogId: new Types.ObjectId(blogId),                    //string to OObjectId machen!!
        comment })
        
    logger.info('Comment successfully created')
=======
    const createdComment = await commentService.createComment(userId, blogId, comment)

>>>>>>> tests
    res.status(201).json({
        blogId,                     
        userId,                     
        createdComment
    })
})

export default commentBlog