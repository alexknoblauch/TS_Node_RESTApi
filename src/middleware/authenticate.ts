/**
 * Custom Modules
 */
import { verifyAccessToken } from "@/lib/jwt";
import logger from "@/lib/winston";
/**
 * Custom Modules
 */
import AppError from "@/utils/AppError";
import catchAsync from "@/utils/catchAsync";
import { authError } from "@/utils/Error files/authError";
/**
 * Types
 */
import type { Request, Response, NextFunction } from 'express'

export default catchAsync(async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw authError(req, 'Invalid Token')
    }
 
    const [_, token] = authHeader.split(' ');
    const jwtPayload = verifyAccessToken(token) as { userId: string };

    req.userId = jwtPayload.userId;
    
    next();
})