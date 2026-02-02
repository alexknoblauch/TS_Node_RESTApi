/**
 * Custom Modules
 */
import authService from "@/services/auth.service";
import catchAsync from "@/utils/async/catchAsync";
/**
 *  Types
 */

import type { Request, Response, NextFunction } from 'express'

const login = catchAsync(async(req: Request, res: Response) => {
    const credentials = req.body                           // Achtung: kein destructoring
    const {accessToken, refreshToken} = await authService.login(credentials) 

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Tage
    })

    res.status(200).json({
        accessToken,
    })
})

export default login