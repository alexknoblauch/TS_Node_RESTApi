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
 * Repos
 */

import { createUserRepository, UserResponse } from "@/Repositories/userRepository";

const userRepository = createUserRepository()

 
const deleteUser = (async (id: string):Promise<boolean> => {
    const userToDelete = await userRepository.findById(id)

    if (!userToDelete) {
        const error = new Error('User not found') as AppError;
        error.statusCode = 404;
        error.code = 'UserNotFound';
        throw error;
    }

    const result = await userRepository.deleteOne(id)
    logger.info('A user Account has been deleted.', {
        id
    })

    if(!result){
        const error = new Error('User deletion failed') as AppError;
        error.statusCode = 400;
        error.code = 'DeleteFailed';
        throw error;    
    }

    logger.info('User account has been deleted', {
        userId: id,
        email: userToDelete.email, 
        username: userToDelete.userName
    });

    return result

})

export default deleteUser