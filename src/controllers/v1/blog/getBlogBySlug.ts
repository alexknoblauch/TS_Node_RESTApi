/**
 * Node Modules
 */

/**
 * Custom Models
 */
import logger from "@/lib/winston";
import { AppError } from "@/middleware/errorHandler";

/**
 * Models
 */
import Blog, { IBlog } from "@/models/blog";
import catchAsync from "@/utils/catchAsync";
import config  from '@/config/index'
import User from "@/models/user";

/**
 * Types
 */
import type { Request, Response } from 'express'
import blog from "@/models/blog";
import { userRepository } from "@/repository/userRepository/userRepository";
import { blogRepository } from "@/repository/blogRepository/blogreposiroty";



const getBlogBySlug = (async function(userId: string, slug: string): Promise<IBlog[] | null>{

    const user = await userRepository.findById(userId)
    if(!user) { 
        const error = new Error('User not found for role settnigs') as AppError
        error.statusCode = 404                                                  //Rolle vergeben
        error.code = 'ApiError'
        throw error
    } 
    
    const data = await blogRepository.findBySlug(slug)
    
    data?.map(data => {
        if(user.role === 'user'&& data?.status === 'draft'){

            logger.warn('A User tried to access Draft Blog')
            throw new Error('User can not access Draft Blog')
        }
        

        if(!data){
            const error = new Error('No Blogs found for slug') as AppError
            error.statusCode = 404
            error.code = 'ApiError'
            throw error
        }
    })

    return data
})

export default getBlogBySlug