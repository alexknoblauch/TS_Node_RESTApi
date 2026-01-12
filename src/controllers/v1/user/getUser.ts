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


const getUser = (async function (userId:string) {

    const user = await User.findById(userId).select('-__v').exec()
    if(user == null){
        const error = new Error('User not found') as AppError;
        error.statusCode = 404;
        error.code = 'UserNotFound';
        throw error;
    }

})

export default getUser