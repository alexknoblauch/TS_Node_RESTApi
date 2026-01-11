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
import User, { IUser } from "@/models/user";

/**
 * Types
 */
import type { Request, Response } from 'express'
import getOrSetRedis from "@/utils/getOrSetRedis";
import { validateRequired } from "@/utils/validateRequired";
import { ensureDocument } from "@/utils/ensureDocument";
import { ensureArray } from "@/utils/ensureArray";
import { BlogResponse, createBlogRepository } from "@/Repositories/blogRepository";

interface QueryType {
  status?: 'published' | 'draft';                   //Interface optional aber empfehelnswert
}

type BlogsByUserResponse = {                        //spezieller rückgabe type für getBlogsByUser     
  data: BlogResponse[];
  author: BlogResponse['author'] | null;
};

const userRepository = createUserRepository()
const blogRepository = createBlogRepository()


const getBlogsByUser = (async function(id: string, targetUserId: string, query: QueryType, limit: number, skip: number, select: string = '-__v -banner.publicId', sort?: string): Promise<BlogsByUserResponse>{
    const user = await userRepository.findById(id)

    ensureDocument(user, 'user')

    if(user.role === 'user'){
        query.status = 'published'
    }


    const data = await blogRepository.getBlogsByUser(id, targetUserId, query, limit, skip, select, sort);    
    const author = data[0]?.author;

    ensureArray(data, 'Blog')
        
    logger.info('Blogs of user successfulls retreived')

    return {data, author}
})

export default getBlogsByUser