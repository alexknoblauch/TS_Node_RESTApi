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

import type { Request, Response, NextFunction, RequestHandler } from 'express'
import  { AppError }  from "@/middleware/errorHandler";

export type AuthRole = 'admin' | 'user'

const authorize = (roles: AuthRole[]): RequestHandler  => {     // RequestHandler = return wert einer Middelware
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        
        const userId = req.userId
        const user = await User.findById(userId)

        if(!user){
            const error = new Error('Access denied, no User found') as AppError;
            error.statusCode =  404;
            error.code = 'UserNotFound'; 
            throw error;
        }        

        if(!roles.includes(user.role)){
            const error = new Error('Access denied, Roles not correct') as AppError;
            error.statusCode = 403;
            error.code = 'AuthorizationError';
            throw error;        
        }

        next()
    })
}

export default authorize