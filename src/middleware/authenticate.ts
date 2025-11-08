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
        res.status(401).json({
            code: 'AuthenticationError',
            message: 'No Authorization header or invalid format'
        });
        return;
    }
 
    const [_, token] = authHeader.split(' ');

    try {
        const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };
        req.userId = jwtPayload.userId;
        next();
    } catch (err) {
        res.status(401).json({
            code: 'AuthenticationError',
            message: 'Token verification failed'
        });
        return;
    }
}