/**
 * Custom Modules
 */
import  logger  from "@/lib/winston";
import config from "@/config";
import catchAsync from "@/utils/catchAsync";

/**
 *  Models
 */

import Token from '@/models/token'

/**
 * Types
 */

import type { Request, Response } from 'express'
import authService from "@/services/auth.service";
import { AppError } from "@/middleware/errorHandler";


const logout = catchAsync(async function(req: Request, res: Response): Promise<void>{
    const refreshToken = req.cookies.refreshToken
    const userId = req.userId as string

<<<<<<< HEAD
    if (refreshToken){
        Token.deleteOne({token: refreshToken})
    }
    
    logger.info('User refresh Token deleted successfully', {
        userId: req.userId,
        token: refreshToken
    })
=======
    await authService.logout(refreshToken, userId)
>>>>>>> tests

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict'
    })
    
    res.status(204).send()
})

export default logout