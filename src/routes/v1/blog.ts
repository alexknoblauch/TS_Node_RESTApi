/**
 *  Node Modules
 */

import { Request, Response, Router } from 'express'
import { body, cookie, param } from 'express-validator'
import bcrypt from 'bcrypt'
import multer from 'multer'

/**
 *  Custom Modules
 */
import  User, { IUser }  from '@/models/user'
import  login from '@/controllers/v1/auth/login'
import  logout from '@/controllers/v1/auth/logout'

/**
 * Middleware
 */
import { refreshToken } from '@/controllers/v1/auth/refresh-token'

/**
 * Controllers
 */
import validationErrorMiddelware from '@/middleware/validationError'
import authenticate from '@/middleware/authenticate'
import authorize from '@/middleware/authorize'
import createBlog from '@/controllers/v1/blog/createBlog'
import uploadBlogBanner from '@/middleware/uploadBlogBanner'
import getAllBlogs from '@/controllers/v1/blog/getAllBlogs'
import getBlogByUser from '@/controllers/v1/blog/getBlogsByUser'
import updateBlog from '@/controllers/v1/blog/updateBlog'
import deleteBlog from '@/controllers/v1/blog/deleteBlog'
import { FilterQuery } from 'mongoose'
import { BlogData, IBlog } from '@/models/blog'
import validateCreateBlog from '@/middleware/validate/blog/validateCreateBlog'
import validateUpdateBlog from '@/middleware/validate/blog/validateUpdateBlog'
import xss from 'xss'
import getBlogsByUser from '@/controllers/v1/blog/getBlogsByUser'
import getBlogBySlug from '@/controllers/v1/blog/getBlogBySlug'

/**
 *  Models
 */

const router = Router()
const upload = multer()

/**
 * Types
 */
interface QueryType {
  status?: 'published' | 'draft';
}


router.post('/', 
    authenticate, 
    authorize(['user', 'admin']), 
    //upload.single('banner_images'),                       //param in body (key) req.params postman
    //uploadBlogBanner('post'),
    //body('banner_image').notEmpty().withMessage('Banner Image is required'),
    validateCreateBlog(), 
    validationErrorMiddelware,
    createBlog
)


router.get('/', 
    authenticate, 
    authorize(['admin', 'user']), 
    validationErrorMiddelware,
        getAllBlogs
    )                           //COPY


router.get('/user/:userId',                     
    authenticate, 
    authorize(['admin', 'user']),
    param('userId').isMongoId().withMessage('invalid id format'), 
    validationErrorMiddelware,
        async(req: Request, res: Response) => {
                const limit = Number(req.query.limit as string) || 10           // limit sort ect ist IMMER req.query
                const skip = Number(req.query.offset as string) || 0
                const userId = req.userId
                
                if(!userId) {
                    return res.status(401).json({
                        code: 'Unauthorized',
                        message: 'User not authenticated'
                    })
                }

                const queryId = req.params.id             // user/:userId
                const query: QueryType = {} 

                const data = await getBlogsByUser(userId, query, queryId, skip, limit)

                res.status(200).json({
                    code: 'ApiSuccess',
                    message: 'Blogs of user successfully retrieved',
                    blogs: data
                })
        }
    )                          // PASTE getAllBlogs & Edit, es ist fast alles gleich 


router.get('/:slug',                     
    authenticate, 
    authorize(['admin', 'user']),
    param('slug').notEmpty().withMessage('Slug parameter needs value'), 
    validationErrorMiddelware,
        async(req: Request, res: Response) => {
            const userId = req.userId

            if(!userId) {
                return res.status(401).json({
                    code: 'Unauthorized',
                    message: 'User not authenticated'
                })
            }
            const slug = req.params.slug             // /:slug
            const data = await getBlogBySlug(userId, slug)

            res.status(200).json({
                code: 'ApiSuccess',
                message: 'Blog for slug successfully retrieved',
                blogs: data
            })
        }
    )                          // PASTE getBlogByUser & Edit, es ist fast alles gleich 


router.patch('/:blogId',
    authenticate,
    authorize(['admin']),
    validateUpdateBlog(),
    validationErrorMiddelware,
    uploadBlogBanner('put'),
        async(req: Request, res: Response) => {
            const {title, content, banner, status} = req.body as BlogData
            if(req.body == null) return
            const userId = req.userId
            if(!userId) {
                return res.status(401).json({
                    code: 'Unauthorized',
                    message: 'User not authenticated'
                })
            }
            const blogId = req.params.blogId

            const blog = await updateBlog(userId, blogId, title, content, banner, status)

            res.status(200).json({ blog })
        }
)                              //COPY PAST createBlog

router.delete('/:blogId', 
    authenticate,
    authorize(['admin']),                       //kein body, kein validator nur ID params
    validationErrorMiddelware,
        
    
)

export default router