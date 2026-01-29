/**
 * Custom Modules
*/
import catchAsync from "@/utils/async/catchAsync"

/**
 * Types
 */
import { Request, Response } from "express"
import commentService from "@/services/comment.service"



const deleteComment = catchAsync(async(req: Request, res: Response) => {
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
    })

export default deleteComment