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
<<<<<<< HEAD
import { ensureDocument } from "@/utils/ensureDocument";
=======
import authService from "@/services/auth.service";
>>>>>>> tests


export const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies

<<<<<<< HEAD
    const tokenExists = await Token.exists({ token: refreshToken })

    ensureDocument(tokenExists, 'Token exists')
=======
    if (!refreshToken) {
        return res.status(400).json({
            success: false,
            code: 'MissingToken',
            message: 'Refresh token is required'
        });
    }
>>>>>>> tests

    const accessToken = await authService.refreshToken(refreshToken)
    
    res.status(200).json({
        message: 'refresh JWT success',
        accessToken
    })
})