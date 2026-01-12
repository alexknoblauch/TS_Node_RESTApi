/**
 * Modules
 */

import User from "@/models/user";


/**
 * Middleware
 */
 import type { AppError } from '@/middleware/errorHandler'

/**
 * Custom Modules
 */

import logger from "@/lib/winston";


/**
 * Custom Types
 */

import type {Request, Response } from 'express'
import catchAsync from "@/utils/catchAsync";
import { userRepository } from "@/repository/userRepository";
import { blogRepository } from "@/repository/blogreposiroty";
 
const deleteUser = (async (userId: string):Promise<void> => {

    const result = await userRepository.deleteById(userId)

    const blogs = await blogRepository.find({author: userId})

    // await cloudenary.delete(banner)                  //img löschen

    const deletedResults = await Promise.all(blogs.map(async(blog) => {
        const result = await blogRepository.delete(blog._id.toString())
        return result
    }))

    
    const failedDeletes = deletedResults.filter(res => !res)
    if (failedDeletes.length > 0) {
        logger.error('Einige Blogs konnten nicht gelöscht werden', { failedDeletes })
    }

})

export default deleteUser