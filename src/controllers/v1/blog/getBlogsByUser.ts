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
<<<<<<< HEAD
import type { Request, Response } from 'express'
import getOrSetRedis from "@/utils/getOrSetRedis";
import { validateRequired } from "@/utils/validateRequired";
import { ensureDocument } from "@/utils/ensureDocument";
import { ensureArray } from "@/utils/ensureArray";
=======
>>>>>>> tests

interface QueryType {
  status?: 'published' | 'draft';
}


<<<<<<< HEAD
const getBlogsByUser = catchAsync(async function(req: Request, res: Response): Promise<void>{
    let limit = Number(req.query.limit) || config.defaultResLimit;
    let skip = Number(req.query.offset) || config.defaultOffset;
    
    if (limit < 1) limit = 1;
    if (skip < 0) skip = 0;

    const currentId = req.userId
    const queryId = req.params.id             // user/:userId
    const query: QueryType = {} 
    
    const user = await User.findById(currentId).select('role').lean().exec()

    ensureDocument(user, 'user')

    if(user.role === 'user'){
        query.status = 'published'
    }

    const total = await Blog.countDocuments({author: queryId, ...query})  //spread Opterator nicht vergessen!!
    const cacheKey = `Blog-${queryId}:${user.role}:${limit}:${skip}` 

    const blog = await getOrSetRedis(cacheKey, async () => {
        const data = await Blog.find({author: queryId, ...query})
        .select('title slug content banner.url author viewsCount likesCount commentsCount status createdAt')
        .populate('author', 'name email avatar')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .lean()
        .exec()

        const author = data[0]?.author;

        ensureArray(data, 'Blog')
        
        return {data, author}                       // 2 Export (data & author)
        })


    res.status(200).json({
        code: 'ApiSuccess',
        message: 'Blogs of user successfully retrieved',
        blogs: blog.data,                          // 2 Exporte = blog.data
        author: blog.author                        // 2 Exporte = blog.author
    })
    logger.info('Blogs of user successfulls retreived')
})
=======
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
>>>>>>> tests

export default getBlogsByUser