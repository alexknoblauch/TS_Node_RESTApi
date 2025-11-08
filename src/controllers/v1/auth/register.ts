/**
 * Custom Models
 */ 
import logger from '@/lib/winston'
import  { genUsername }  from '@/utils/index'
import { generateAccessToken, generateRefreshToken} from '@/lib/jwt'
import Token from '@/models/token'
import config from '@/config'
import catchAsync from '../../../utils/catchAsync';

/**
 * Models
 */ 
import User from '@/models/user'

/**
 * Types
 */ 

import type {Request, Response} from 'express'
import type { IUser } from '@/models/user'



type UserData = Pick<IUser, 'email' | 'password' | 'role'>

const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const {email, password, role } = req.body as UserData

    if( role === 'admin' && !config.WHITELIST_ADMINS_EMAIL.includes(email)){
        res.status(403).json({
            code: 'AuthorizationError',
            message: 'Email not allowed for admin registration'
        })

        logger.warn(`Registration as admin failed: ${email}`)
         throw new Error('Email not allowed for admin registration');
    }

    const userName = genUsername()
    const newUser = await User.create({userName, email, password, role})
    const accessToken = generateAccessToken(newUser._id)
    const refreshToken = generateRefreshToken(newUser._id)

    await Token.create({token: refreshToken, userId: newUser._id })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    })
    
    res.status(201).json({
        user: {
            username: userName,
            email,
            role
        },
        accessToken
    })

    logger.info('User registred successfully', {
            username: userName,
            email: email,
            role: role
    })

})

export default register