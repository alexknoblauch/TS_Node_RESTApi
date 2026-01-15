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
import User, { IUser } from "@/models/user";

/**
 * Types
 */
import type { Request, Response } from 'express'
import { FilterQuery } from "mongoose";
import { userRepository } from "@/repository/userRepository/userRepository";
import { blogRepository } from "@/repository/blogRepository/blogreposiroty";


const getBlogsByUser = (async function(userId: string, query: FilterQuery<IBlog> , queryId: string, skip: number, limit: number): Promise<IBlog[]>{
    
    const user = await userRepository.findById(userId)
    if(!user) { 
        const error = new Error('User not found for role settnigs') as AppError
        error.statusCode = 404                                                          //Rolle vergeben
        error.code = 'ApiError'
        throw error
    }

    if(user.role === 'user'){
        query.status = 'published'
    }
    
    const data = await blogRepository.find({author: queryId, ...query}, {skip, limit})

    if(!data || data.length === 0){
        const error = new Error('No Blogs found for user') as AppError
        error.statusCode = 404
        error.code = 'ApiError'
        throw error
    }

    return data

})

export default getBlogsByUser