/**
 * Custom Modules
 */
import  logger  from "@/lib/winston";
import config from "@/config";
import catchAsync from "@/utils/async/catchAsync";

/**
 *  Models
 */

import Token from '@/models/token'

/**
 * Types
 */

import type { Request, Response } from 'express'
import authService from "@/services/auth.service";


const logout = catchAsync(async function(req: Request, res: Response): Promise<void>{
    const refreshToken = req.cookies.refreshToken

    await authService.logout(refreshToken)

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict'
    })
    
    res.status(204).send()
})

export default logout