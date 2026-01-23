/**
 * Node Modules
 */
import Comment, { CommentData, IComment } from "@/models/comment"
import commentService from "@/services/comment.service"
import catchAsync from "@/utils/catchAsync"
/**
 * Types
 */
import { Request, Response } from "express"


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
    const createdComment = await commentService.createComment(userId, blogId, comment)

    res.status(201).json({
        blogId,                     
        userId,                     
        createdComment
    })
})

export default commentBlog