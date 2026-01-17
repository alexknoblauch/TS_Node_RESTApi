/**
 * Types
 */
import type { Request, Response } from 'express'
/**
 * Services
 */

import blogService from "@/services/blog.service";



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

            res.status(200).json({
                code: 'ApiSuccess',
                message: 'Blog for slug successfully retrieved',
                blogs: data
            })
        }
    )

export default getBlogBySlug