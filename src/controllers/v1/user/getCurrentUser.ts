/**
 * Custom Modules
 */

import logger from "@/lib/winston";

/**
 * Models
 */

import User from "@/models/user";
import catchAsync from "@/utils/catchAsync";

/**
 * Types
 */

import type {Request, Response} from 'express'

const getCurrentUser = catchAsync(async (req: Request, res: Response): Promise<void> =>{
    const userId = req.userId
    const user = await User.findById(userId).select('-__v').lean().exec()
    
    res.status(200).json({
        user
    })
}) 

export default getCurrentUser