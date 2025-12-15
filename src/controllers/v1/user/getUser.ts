/**
 * Node Modules
 */

/**
 * Custom Modules
 */
/**
 * Models
 */

import User from "@/models/user";
/**
 * Middleware
 */
import logger from "@/lib/winston";
import catchAsync from "@/utils/catchAsync";

/**
 * Types
 */
import type { Request, Response } from "express";
import type { AppError } from "@/middleware/errorHandler";
import getOrSetRedis from "@/utils/getOrSetRedis";


const getUser = catchAsync(async function (req: Request, res: Response) {
    const userId = req.params.userId

    const cacheKey = `User:${userId}`

    const data = await getOrSetRedis(cacheKey, async () => {
        const user = await User.findById(userId).select('-__v -password -refreshToken').lean().exec()

        if(user == null){
            const error = new Error('User not found') as AppError;
            error.statusCode = 404;
            error.code = 'UserNotFound';
            throw error;
        }
        return user 
    })


    res.status(200).json({
        code: 'Success',
        message: 'User successfully retreaved.',
        user: data
    })
})

export default getUser