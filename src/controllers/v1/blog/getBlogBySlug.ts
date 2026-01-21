/**
 * Types
 */
import type { Request, Response } from 'express'
<<<<<<< HEAD
import blog from "@/models/blog";
import getOrSetRedis from "@/utils/getOrSetRedis";
import { validateRequired } from "@/utils/validateRequired";
import { ensureDocument } from "@/utils/ensureDocument";
=======
/**
 * Services
 */

import blogService from "@/services/blog.service";
>>>>>>> tests



const getBlogBySlug = (async(req: Request, res: Response) => {
            const userId = req.userId 

            if(!userId) {
                return res.status(401).json({
                    code: 'Unauthorized',
                    message: 'User not authenticated'
                })
            }
            const slug = req.params.slug             // /:slug
            const data = await blogService.getBlogBySlug(userId, slug)

<<<<<<< HEAD
    validateRequired(userId, 'userID')
    validateRequired(slug, 'Slug')
    
    const user = await User.findById(userId).select('role').lean().exec()
    ensureDocument(user, 'User')

    const cacheKey = `Blog-${slug}-${user.role}`

    const blog = await getOrSetRedis(cacheKey, async () => {
        const data = await Blog.findOne({slug})
        .select('-banner.publicId -__v')
        .populate('author', '-createdAt -updatedAt -__v')
        .lean()
        .exec()

            if(user.role === 'user' && data?.status === 'draft'){
            logger.warn('A User tried to access Draft Blog')
            throw new Error('User can not access Draft Blog')
            }

            ensureDocument(data, 'Fetch Data')

            return data
    })
    

    res.status(200).json({
        code: 'ApiSuccess',
        message: 'Blog for slug successfully retrieved',
        blogs: blog
    })
    logger.info('Blogs for slug successfulls retreived')
})

export default getBlogsByUser
=======
            res.status(200).json({
                code: 'ApiSuccess',
                message: 'Blog for slug successfully retrieved',
                blogs: data
            })
        }
    )

export default getBlogBySlug
>>>>>>> tests
