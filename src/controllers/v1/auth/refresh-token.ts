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
import catchAsync from "@/utils/catchAsync";

/**
 * Types
 */

import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import authService from "@/services/auth.service";


export const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
        return res.status(400).json({
            success: false,
            code: 'MissingToken',
            message: 'Refresh token is required'
        });
    }

    const accessToken = await authService.refreshToken(refreshToken)
    
    res.status(200).json({
        message: 'refresh JWT success',
        accessToken
    })
})