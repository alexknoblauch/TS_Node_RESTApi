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
import { AppError } from "./errorHandler";


declare global {
  namespace Express {
    interface Request {                 // damit req.userId in Request aufgenommen wird
      userId?: Types.ObjectId;   
    }
  }
}
export default function authenticate(req: Request, res: Response, next: NextFunction): void {
    
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
        const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };
        req.userId = jwtPayload.userId;
        next();
     } catch (err) {
        logger.error('Token verfication failed')
        const error = new Error('Token verfication failed') as AppError;
        error.statusCode = 401;
        error.code = 'BeararNotFound';
        throw error;
    }
}