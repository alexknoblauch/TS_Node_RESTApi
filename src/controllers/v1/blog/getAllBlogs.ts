/**
 * Node Modules
 */

/**
 * Custom Models
 */
import logger from "@/lib/winston";
import { AppError } from "@/middleware/errorHandler";
import { BlogResponse, createBlogRepository, SortOptions } from "@/Repositories/blogRepository";

/**
 * Models
 */
import Blog, { QueryType } from "@/models/blog";
import catchAsync from "@/utils/catchAsync";
import config  from '@/config/index'
import User from "@/models/user";

/**
 * Types
 */
import type { Request, Response } from 'express'
import getOrSetRedis from "@/utils/getOrSetRedis";
import { ensureDocument } from "@/utils/ensureDocument";
import { ensureArray } from "@/utils/ensureArray";
import blog from "@/models/blog";

const blogRepository = createBlogRepository()


const getAllBlogs = (async function(userId: string, query: QueryType, limit: number, skip: number, select: string = '-__v -banner.publicId', sort?: string): Promise<BlogResponse[]>{ 
    const user = await Blog.findById(userId).select('role').lean().exec() as IUser
    ensureDocument(user, 'User')
    
    if(user.role === 'user'){
        query.status = 'published'
    }
    
    const cacheKey = `blogs:${user.role}:limit:${limit}:skip:${skip}`
    
    const data = await getOrSetRedis(cacheKey, async () => {
        const blogs = await blogRepository.getAllBlogs(userId, query, limit, skip, select, sort)


        ensureArray(blogs, 'blogs')

        return blogs
    })

    return data

    logger.info(`Blogs successfully retrieved ${data.length} blogs`)
})

export default getAllBlogs