/**
 * Custom Modules
 */

import getOrSetRedis from "@/infra/cache/getOrSetRedis";
import logger from "@/lib/winston";

/**
 * Models
 */

import User from "@/models/user";
import catchAsync from "@/utils/async/catchAsync";

/**
 * Types
 */

import type {Request, Response} from 'express'

const getCurrentUser = catchAsync(async (req: Request, res: Response): Promise<void> =>{
    const userId = req.userId

    const cacheKey = `User:${userId}`

    const data = await getOrSetRedis(cacheKey, async () => {
        const user = await User.findById(userId).select('-__v -password -refreshToken').lean().exec()
        return user
    })
    
    res.status(200).json({
        user: data
    })
}) 

export default getCurrentUser