/**
 * Node Modules
 */

/**
 * Custom Models
 */
import logger from "@/lib/winston";
import { AppError } from "@/middleware/errorHandler";
import { createUserRepository } from "@/Repositories/userRepository";

/**
 * Models
 */
import Blog from "@/models/blog";
import catchAsync from "@/utils/catchAsync";
import config  from '@/config/index'
import User from "@/models/user";

/**
 * Types
 */
import type { Request, Response } from 'express'
import getOrSetRedis from "@/utils/getOrSetRedis";
import { validateRequired } from "@/utils/validateRequired";
import { ensureDocument } from "@/utils/ensureDocument";
import { ensureArray } from "@/utils/ensureArray";
import { BlogResponse } from "@/Repositories/blogRepository";

interface QueryType {
  status?: 'published' | 'draft';                   //Interface optional aber empfehelnswert
}

const userRepository = createUserRepository()


const getBlogsByUser = (async function(currentId: string, queryId: string, query: QueryType, limit: string, skip: string): Promise<BlogResponse[]>{
    const user = await userRepository.findById(currentId)

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

export default getBlogsByUser