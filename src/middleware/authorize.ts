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
import { ensureDocument } from "@/utils/ensureDocument";
import AppError from "@/utils/AppError";

export type AuthRole = 'admin' | 'user'

const authorize = (roles: AuthRole[]): RequestHandler  => {     // RequestHandler = return wert einer Middelware
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        
        const userId = req.userId
        const user = await User.findById(userId)
        ensureDocument(user, 'User')     

        if(!roles.includes(user.role)){

            logger.info('Access denied, Roles not correct', {
                reason: 'ROLE_DENIED',   
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                action: 'AUTH_ATTEMPT'
            })
            throw new AppError('Access denied, Roles not correct', 401, 'AuthorizationError');      
        }

        next()
    })
}

export default authorize