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
import commentService from "@/services/comment.service"



const deleteComment = async(req: Request, res: Response) => {
        const userId = req.userId 
                    
        if(!userId) {
            return res.status(401).json({
                code: 'Unauthorized',
                message: 'User not authenticated'
            })
        }    
                                         
        const { commentId } = req.params                               
        await commentService.deleteComment(userId, commentId)

        res.status(201)
    }

export default deleteComment