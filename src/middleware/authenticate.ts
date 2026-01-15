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
import { userRepository } from "@/repository/userRepository/userRepository";


export default async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    
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
        res.status(401).json({
            code: 'AuthenticationError',
            message: 'Token verification failed'
        });
        return;
    }
}