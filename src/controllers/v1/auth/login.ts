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
import { ensureDocument } from "@/utils/ensureDocument";

export type UserData = Pick<IUser, 'email' | 'password'>


const login = catchAsync(async function(req: Request, res: Response): Promise<void>{
    const {email, password} = req.body as UserData
    const user = await  User.findOne({email}).select('email username password role').lean().exec()

    ensureDocument(user, 'User')

    const pwCorrect = await bcrypt.compare(password, user.password)

    if(!pwCorrect){
        res.status(404).json({
            message: 'wrong password'
        })
        return
    }
    
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    await Token.create({token: refreshToken, userId: user._id})
    
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // ← In Development = false
        sameSite: 'lax', // ← 'strict' kann auch Probleme machen
        maxAge: 7 * 24 * 60 * 60 * 1000 // ← Wichtig: Expiry setzen!
    })
    

    logger.info('user successfully logged in', user)

    res.status(200).json({
        user: {
            username: user.userName,
            email: user.email,
            role: user.role
        },
        accessToken
    })
})

export default login