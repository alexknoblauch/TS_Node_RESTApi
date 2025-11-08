/**
 * Node Modules
 */
import authenticate from "@/middleware/authenticate";
import authorize from "@/middleware/authorize";
import { Express, Router } from "express";
import { param } from "express-validator"
/**
 * Custom Modules
 */
/**
 * Types
 */
/**
 * Middelware
 */
/**
 * Models
 */
/**
 * Controllers
 */
import likeBlog from "@/controllers/v1/like/likeBlog";
import unlikeBlog from "@/controllers/v1/like/unlikeBlog";

const router = Router()

router.post('/blog/:blogId',
    authenticate,
    authorize(['admin', 'user']),
    param('blogId').isMongoId().withMessage('blog ID invalid'),
    likeBlog
    )

router.delete('/blog/:blogId',
    authenticate,
    authorize(['admin', 'user']),
    param('blogId').isMongoId().withMessage('blog ID invalid'),
    unlikeBlog
    )


export default router