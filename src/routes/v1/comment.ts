/**
 * Node Modules
 */
import authenticate from "@/middleware/authenticate";
import authorize from "@/middleware/authorize";
import validationErrorMiddelware from "@/middleware/validationError";
import { Router } from "express";
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

const router = Router()

router.post('/blogId/:blogId',
    authenticate,
    authorize(['user', 'admin']),
    param('blogId')
    .isMongoId()
    .withMessage('ID wrong format'),
    body('content')
    .isEmpty()
    .withMessage('content must have value'),
    validationErrorMiddelware,
    commentBlog
)

router.get('/blogId/:blogId',
    authenticate,
    authorize(['user', 'admin']),
    param('blogId')
    .isMongoId()
    .withMessage('ID wrong format'),
    validationErrorMiddelware,
    getCommentsByBlog
)

router.get('/:commentId',
    authenticate,
    authorize(['user', 'admin']),
    param('commentId')
    .isMongoId()
    .withMessage('ID wrong format'),
    validationErrorMiddelware,
    deleteComment
)

export default router

