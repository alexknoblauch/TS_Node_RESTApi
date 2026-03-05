/**
 * Custom Modules
 */
import { authError } from "@/errors/http/authError";
import { verifyAccessToken } from "@/lib/jwt";
/**
 * Custom Modules
 */
import catchAsync from "@/utils/async/catchAsync";
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