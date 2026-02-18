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
    const userId = req.userId                                   // params = string interference
    const { blogId } = createCommentSchema.parse(req.params)                               // das auch string interference
    const { comment } = createCommentSchema.parse(req.body)              // Wichtig Typisieren!
    
    if(!userId) {
        return res.status(401).json({
            code: 'Unauthorized',
            message: 'User not authenticated'
        })
    }    
                             
    const credentials = { userId, blogId, comment }
    const validatedCredentials = createCommentSchema.parse(credentials)
    const createdComment = await commentService.createComment(credentials)

    res.status(201).json({
        blogId,                     
        userId,                     
        createdComment
    })
})

export default commentBlog