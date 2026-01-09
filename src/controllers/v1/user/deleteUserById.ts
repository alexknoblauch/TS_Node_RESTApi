/**
 * Modules
 */

import User from "@/models/user";
import Blog from "@/models/blog";


/**
 * Middleware
 */
 import type { AppError } from '@/middleware/errorHandler'

/**
 * Custom Modules
 */

import catchAsync from "@/utils/catchAsync";
import logger from "@/lib/winston";
/**
 * Repos
 */

import { createUserRepository  } from "@/Repositories/userRepository";

const userRepository = createUserRepository()





const deleteUserById = (async function (userId: string): Promise<{deletedCount: number}> {
    const result = await userRepository.deleteOne(userId)

    const blogs = await Blog.find({author: userId}).select('banner.publicId').lean().exec()

    // await cloudenary.delete(banner)                  //img löschen

    await Blog.deleteMany({author: userId})
    logger.info('Blogs of User delted', {
        userId,
        blogs
    })
    
    if (result.deletedCount === 0) {                                //deleteCount ist mongoose method
        const error = new Error('User not found') as AppError;
        error.statusCode = 404;
        error.code = 'UserNotFound';
        throw error;
    }

    return result
})

export default deleteUserById