/**
 * Node Modules
 */

/**
 * Custom Modules
 */
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import config from "@/config";
import { Jwt } from "jsonwebtoken";
import logger from "@/lib/winston";


/**
 *  Models
 */
import User from "@/models/user";
import Token from "@/models/token";
import bcrypt from 'bcrypt'

/**
 *  Types
 */

import type { Request, Response, NextFunction } from 'express'
import type { IUser } from "@/models/user";
import catchAsync from "@/utils/catchAsync";

export type UserData = Pick<IUser, 'email' | 'password'>


const login = catchAsync(async function(req: Request, res: Response): Promise<void>{
    const {email} = req.body as UserData
    const user = await  User.findOne({email}).select('email username password role').lean().exec()

    if(!user) {
        res.status(404).json({
            code: 'AuthError',
            message: 'User not found'
        })
        return
    }

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    await Token.create({token: refreshToken, userId: user._id})

    logger.info('Refresh Token created for', {
        userId: user._id,
        token: refreshToken
    })
    
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // ← In Development = false
        sameSite: 'lax', // ← 'strict' kann auch Probleme machen
        maxAge: 7 * 24 * 60 * 60 * 1000 // ← Wichtig: Expiry setzen!
    })
    

    logger.info('user successfully created', user)

    res.status(201).json({
        user: {
            username: user.userName,
            email: user.email,
            role: user.role
        },
        accessToken
    })
})

export default login