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


const logout = catchAsync(async function(req: Request, res: Response): Promise<void>{
    const refreshToken = req.cookies.refreshToken as String

    if (refreshToken){
        Token.deleteOne({token: refreshToken})
    }
    
    logger.info('User refresh Token deleted successfully', {
        userId: req.userId,
        token: refreshToken
    })

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict'
    })
    
    res.status(204)

    logger.info('User logged out successfully', {
        userId: req.userId
    })
})

export default logout