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


export const refreshToken = catchAsync( async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string

    const tokenExists = await Token.exists({ token: refreshToken })

    if(!tokenExists){
        return res.status(401).json({
            code: 'AuthenticationError',
            messag: 'Invalid refresh token'
        })
    }

    const jwtPayload = verifyRefreshToken(refreshToken) as { userId: Types.ObjectId }
    const accessToken = generateAccessToken(jwtPayload.userId)

    res.status(200).json({
        message: 'refresh JWT success',
        accessToken
    })
})