/**
 * Node Modules
 */

import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

/**
 * Custom Modules
 */

import { verifyAccessToken } from "@/lib/jwt";
import logger from "@/lib/winston";
/**
 * Custom Modules
 */

import type { Request, Response, NextFunction } from 'express'
import type { Types } from 'mongoose'
<<<<<<< HEAD
import { AppError } from "./errorHandler";
=======
import { userRepository } from "@/repository/userRepository/userRepository";
>>>>>>> tests


export default async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        logger.error('No Bearer Token found')
        const error = new Error('No Bearer Token found') as AppError;
        error.statusCode = 401;
        error.code = 'BeararNotFound';
        throw error;
    }
 
    const [_, token] = authHeader.split(' ');

    try {
        const jwtPayload = verifyAccessToken(token) as { userId: string };
        req.userId = jwtPayload.userId;
        const user = await userRepository.findById(req.userId)

        if(!user) {
              res.status(401).json({
              code: 'AuthenticationError',
              message: 'User not found'
          });
          return
        }

        req.userRole = user.role
        next();
     } catch (err) {
        logger.error('Token verfication failed')
        const error = new Error('Token verfication failed') as AppError;
        error.statusCode = 401;
        error.code = 'BeararNotFound';
        throw error;
    }
}