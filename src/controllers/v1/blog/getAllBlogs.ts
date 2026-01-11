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

const blogRepository = createBlogRepository()


const getAllBlogs = (async function(userId: string, query: QueryType, limit: number, skip: number, select: string = '-__v -banner.publicId', sort?: string): Promise<BlogResponse[]>{ 
    const user = await User.findById(userId).select('role').lean().exec()
    ensureDocument(user, 'User')
    
    if(user.role === 'user'){
        query.status = 'published'
    }
    
    const data = await blogRepository.getAllBlogs(userId, query, limit, skip, select, sort)


    ensureArray(data, 'blogs')

    logger.info(`Blogs successfully retrieved ${data.length} blogs`)

    return data
})

export default getAllBlogs