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
    getBlogsByUser
    )                          // PASTE getAllBlogs & Edit, es ist fast alles gleich 


router.get('/:slug',                     
    authenticate, 
    authorize(['admin', 'user']),
    param('slug').notEmpty().withMessage('Slug parameter needs value'), 
    validationErrorMiddelware,
    getBlogBySlug
    )                          // PASTE getBlogByUser & Edit, es ist fast alles gleich 


router.patch('/:blogId',
    authenticate,
    authorize(['admin']),
    validateUpdateBlog(),
    validationErrorMiddelware,
    uploadBlogBanner('put'),
    updateBlog
)                              //COPY PAST createBlog

router.delete('/:blogId', 
    authenticate,
    authorize(['admin']),                       //kein body, kein validator nur ID params
    validationErrorMiddelware,
    deleteBlog
)

export default router