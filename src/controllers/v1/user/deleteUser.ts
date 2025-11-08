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
 
const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const  id  = req.userId 

    const userToDelete = await User.findById(id)

    if (!userToDelete) {
        const error = new Error('User not found') as AppError;
        error.statusCode = 404;
        error.code = 'UserNotFound';
        throw error;
    }

    const result = await User.deleteOne({_id: id})
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

    res.status(204)
})

export default deleteUser