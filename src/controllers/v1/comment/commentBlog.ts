/**
 * Node Modules
 */
import { createCommentSchema } from "@/dto/comment/createComment.schema"
import Comment, { CommentData, IComment } from "@/models/comment"
import commentService from "@/services/comment.service"
import catchAsync from "@/utils/async/catchAsync"
/**
 * Types
 */
import { Request, Response } from "express"


const commentBlog =  catchAsync(async(req: Request, res: Response) => {
    const userId = req.userId                
    const { blogId } = req.params                 
    const { comment } = req.body                 
    
    if(!userId) {
        return res.status(401).json({
            code: 'Unauthorized',
            message: 'User not authenticated'
        })
    }  
    
    
    const credentials = { userId, blogId, comment }
    const validatedCredentials = createCommentSchema.parse(credentials)
    const createdComment = await commentService.createComment(validatedCredentials)

    res.status(201).json({
        blogId,                     
        userId,                     
        createdComment
    })
})

export default commentBlog