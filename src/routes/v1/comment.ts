/**
 * Node Modules
 */
import authenticate from "@/middleware/authenticate";
import authorize from "@/middleware/authorize";
import validationErrorMiddelware from "@/middleware/validationError";
import { Router } from "express";

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
    commentBlog
)

router.get('/blogId/:blogId',
    authenticate,
    authorize(['user', 'admin']),
    calidateCreateComment(),
    validationErrorMiddelware,
    getCommentsByBlog
    
)

router.get('/:commentId',
    authenticate,
    authorize(['user', 'admin']),
    validateDeleteComment(),
    validationErrorMiddelware,
    deleteComment
)

export default router

