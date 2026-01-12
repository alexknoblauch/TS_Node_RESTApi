/**
 * Node Modules
 */
import authenticate from "@/middleware/authenticate";
import authorize from "@/middleware/authorize";
import validationErrorMiddelware from "@/middleware/validationError";
import { Request, Response, Router } from "express";
import { param, body } from "express-validator"
/**
 * Custom Modules
 */
/**
 * Middleware
 */
/**
 * Types
 */
/**
 * Controllers
 */
import commentBlog from "@/controllers/v1/comment/commentBlog";
import getCommentsByBlog from "@/controllers/v1/comment/getCommentsByBlog";
import deleteComment from "@/controllers/v1/comment/deleteComment";
import { CommentData } from "@/models/comment";
import calidateCreateComment from "@/middleware/validate/comment/validateCreateComment";
import validateCreateComment from "@/middleware/validate/comment/validateCreateComment";
import validateDeleteComment from "@/middleware/validate/comment/validateDeleteComment";

const router = Router()

router.post('/blogId/:blogId',
    authenticate,
    authorize(['user', 'admin']),
    validateCreateComment(),
    validationErrorMiddelware,
        async(req: Request, res: Response) => {
            const userId = req.userId                                   // params = string interference
            const { blogId } = req.params                               // das auch string interference
            
            if(!userId) {
                return res.status(401).json({
                    code: 'Unauthorized',
                    message: 'User not authenticated'
                })
            }                             
            const { comment } = req.body as CommentData                 // Wichtig Typisieren!
            const createdComment = await commentBlog(userId, blogId, comment)

            res.status(201).json({
                blogId,                     
                userId,                     
                createdComment
            })
        }
    
)

router.get('/blogId/:blogId',
    authenticate,
    authorize(['user', 'admin']),
    calidateCreateComment(),
    validationErrorMiddelware,
        async(req: Request, res: Response) => {

            const { blogId } = req.params                               

            const allComments = await getCommentsByBlog(blogId)

            res.status(200).json({
                allComments
            })
        } 
    
)

router.get('/:commentId',
    authenticate,
    authorize(['user', 'admin']),
    validateDeleteComment(),
    validationErrorMiddelware,
        async(req: Request, res: Response) => {
        const userId = req.userId 
                    
        if(!userId) {
            return res.status(401).json({
                code: 'Unauthorized',
                message: 'User not authenticated'
            })
        }    
                                         
        const { commentId } = req.params                               
        await deleteComment(userId, commentId)

        res.status(201)
    }
)

export default router

