/**
 * Types
 */
import { Request, Response } from "express"
/**
 * Service
 */
import commentService from "@/services/comment.service"


const getCommentsByBlog =  async(req: Request, res: Response) => {
    const { blogId } = req.params                               

    const allComments = await commentService.getCommentsByBlog(blogId)

    res.status(200).json({
        allComments
    })
} 

export default getCommentsByBlog