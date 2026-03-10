/**
 * Node Modules
 */

/**
 * Custom Modules
*/

import logger from "@/lib/winston";
import { generateAccessToken, verifyRefreshToken } from "@/lib/jwt";

/**
 * Models
 */

import Token from '@/models/token'
import catchAsync from "@/utils/async/catchAsync";

/**
 * Types
 */

import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import authService from "@/services/auth.service";
import config from "@/config";


export const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshTokenInput } = req.cookies

    if (!refreshTokenInput) {
        return res.status(400).json({
            success: false,
            code: 'MissingToken',
            message: 'Refresh token is required'
        });
    }

    //refreshToken rotation
    const {accessToken, refreshToken} = await authService.refreshToken(refreshTokenInput)

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict'
    }) 
    
    res.status(200).json({
        message: 'refresh JWT success',
        accessToken
    })
})