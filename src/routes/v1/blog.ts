/**
 *  Node Modules
 */

import { Router } from 'express'
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
    body('title')
    .trim()
    .notEmpty()
    .withMessage('Title must have a value')
    .isLength({max: 100})
    .withMessage('Title must be less then 100'),
    body('content')
    .trim()
    .notEmpty()
    .withMessage('Body must have a value'),
    body('status')
    .optional()
    .isIn(['draf', 'published'])
    .withMessage('Status must be of the value draft or published'), 
    validationErrorMiddelware,
    createBlog)


router.get('/', 
    authenticate, 
    authorize(['admin', 'user']), 
    validationErrorMiddelware,
    getAllBlogs)                            //COPY


router.get('/user/:userId',                     
    authenticate, 
    authorize(['admin', 'user']),
    param('userId').isMongoId().withMessage('invalid id format'), 
    validationErrorMiddelware,
    getBlogByUser)                          // PASTE getAllBlogs & Edit, es ist fast alles gleich 


router.get('/:slug',                     
    authenticate, 
    authorize(['admin', 'user']),
    param('slug').notEmpty().withMessage('Slug parameter needs value'), 
    validationErrorMiddelware,
    getBlogByUser)                          // PASTE getBlogByUser & Edit, es ist fast alles gleich 


router.patch('/:blogId',
    authenticate,
    authorize(['admin']),
    body('userId')
    .isMongoId()
    .withMessage('ID is in the wrong format.'),
    body('content'),
    body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, draft/published'),
    validationErrorMiddelware,
    uploadBlogBanner('put'),
    updateBlog                                  //COPY PAST createBlog
)

router.delete('/:blogId', 
    authenticate,
    authorize(['admin']),                       //kein body, kein validator nur ID params
    validationErrorMiddelware,
    deleteBlog
)

export default router