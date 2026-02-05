/**
 * Types
 */
import type { Request, Response } from 'express'
/**
 * Services
 */

import blogService from "@/services/blog.service";
import catchAsync from '@/utils/async/catchAsync';
import { ensureDocument } from '@/utils/validation/ensureDocument';



const getBlogBySlug = catchAsync(async(req: Request, res: Response) => {
            const userId = req.userId 
            ensureDocument(userId, 'Userid')

            if(!userId) {
                return res.status(401).json({
                    code: 'Unauthorized',
                    message: 'User not authenticated'
                })
            }
            const slug = req.params.slug             // /:slug
            ensureDocument(slug, 'Slug')
            const data = await blogService.getBlogBySlug(userId, slug)

            res.status(200).json({
                code: 'ApiSuccess',
                message: 'Blog for slug successfully retrieved',
                blogs: data
            })
        }
    )

export default getBlogBySlug
