/**
 *  Node Modules
 */
import { Request, Response, Router } from 'express'
import { param } from 'express-validator'
import multer from 'multer'
import xss from 'xss'
import config from "@/config";


/**
 *  Custom Modules
 */
import  User, { IUser }  from '@/models/user'
import  login from '@/controllers/v1/auth/login'
import  logout from '@/controllers/v1/auth/logout'
import type { IBlog, QueryType } from '@/models/blog'
import type { AppError } from '@/middleware/errorHandler'

/**
 * Types
 */


type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status' >

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
import getBlogsByUser from '@/controllers/v1/blog/getBlogsByUser'
import updateBlog from '@/controllers/v1/blog/updateBlog'
import deleteBlog from '@/controllers/v1/blog/deleteBlog'
import createBlogValidation from '@/middleware/validators/blog/createBlogValidation'
import updateBlogValidation from '@/middleware/validators/blog/updateBlogValidator'
import { validateRequired } from '@/utils/validateRequired'
import getBlogsBySlug from '@/controllers/v1/blog/getBlogBySlug';

/**
 *  Models
 */

const router = Router()
const upload = multer()


import 'express-async-errors';          //Automatisches try catch für express router!! 


router.post('/', 
    authenticate, 
    authorize(['user', 'admin']), 
    //upload.single('banner_images'),                       //param in body (key) req.params postman
    //uploadBlogBanner('post'),
    //body('banner_image').notEmpty().withMessage('Banner Image is required'),
    createBlogValidation(), 
    validationErrorMiddelware,
        async(req: Request, res: Response) => {
            const { title, content, banner, status } = req.body as BlogData
            const userId = req.userId?.toString()

            if(!userId) throw new Error(`No UserId`)
            validateRequired(title, 'Title')
            validateRequired(content, 'Content')
            validateRequired(banner, 'Banner')
            validateRequired(status, 'Status')

            const cleanContent = xss(content)
            const newEntry = await createBlog(title, cleanContent, banner, status, userId)

            res.status(201).json({
                code: 'BlogCreated',
                message: 'Successfully new Blog created',
                newEntry
            })
        }
    )


router.get('/', 
    authenticate, 
    authorize(['admin', 'user']), 
    validationErrorMiddelware,
        async(req: Request, res:Response) => {
            let limit = Number(req.query.limit) || config.defaultResLimit;           // req.query hat Type: string | string[] | undefined
            let skip = Number(req.query.offset) || config.defaultOffset;

            const sort   = req.query.sort as string
            const select = req.query.select as string
            
            if(!sort) throw new Error()
            
            if (limit < 1) limit = 1;
            if (skip < 0) skip = 0;
        
            const userId = req.userId?.toString()
            if(!userId) throw new Error('Id not valid')
            const query: QueryType = {}

            const data = getAllBlogs(userId, query, limit, skip, select, sort)

            res.status(200).json({
                code: 'ApiSuccess',
                message: 'Blogs successfully retrieved',
                blogs: data
            })
        }
    )                            


router.get('/user/:userId',                     
    authenticate, 
    authorize(['admin', 'user']),
    param('userId').isMongoId().withMessage('invalid id format'), 
    validationErrorMiddelware,
    getBlogsByUser)                          // PASTE getAllBlogs & Edit, es ist fast alles gleich 


router.get('/:slug',                     
    authenticate, 
    authorize(['admin', 'user']),
    param('slug').notEmpty().withMessage('Slug parameter needs value'), 
    validationErrorMiddelware,
    getBlogsBySlug)                          // PASTE getBlogByUser & Edit, es ist fast alles gleich 


router.patch('/:blogId',
    authenticate,
    authorize(['admin']),
    updateBlogValidation(),
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