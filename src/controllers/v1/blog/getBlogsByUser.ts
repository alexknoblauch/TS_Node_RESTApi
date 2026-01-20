/**
 * Custom Models
 */

import blogService from "@/services/blog.service";
import catchAsync from "@/utils/catchAsync";

/**
 * Node Modules
 */
import type { Request, Response } from 'express'
/**
 * Types
 */

interface QueryType {
  status?: 'published' | 'draft';
}


const getBlogsByUser = catchAsync(async(req: Request, res: Response) => {
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
        const options = { limit, skip, queryId }
        const query: QueryType = {} 

        const data = await blogService.getBlogsByUser(userId, query, options)

        res.status(200).json({
            code: 'ApiSuccess',
            message: 'Blogs of user successfully retrieved',
            blogs: data
        })
        }
    )

export default getBlogsByUser