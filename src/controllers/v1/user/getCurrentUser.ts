/**
 * Custom Modules
 */

import logger from "@/lib/winston";

/**
 * Models
 */

import User from "@/models/user";
import catchAsync from "@/utils/catchAsync";
import getOrSetRedis from "@/utils/getOrSetRedis";

/**
 * Types
 */

import type {Request, Response} from 'express'

<<<<<<< HEAD
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
=======
const getCurrentUser = (async (userId: string): Promise<void> =>{
    const user = await User.findById(userId)

>>>>>>> tests
}) 

export default getCurrentUser