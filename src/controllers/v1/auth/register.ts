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
import authService from '@/services/auth.service'



type UserData = Pick<IUser, 'email' | 'password' | 'role'>

const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
<<<<<<< HEAD
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
=======
    const credentials = req.body as UserData
>>>>>>> tests

    const {user, accessToken, refreshToken} = await authService.register(credentials)
                
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // ← In Development = false
        sameSite: 'lax', // ← 'strict' kann auch Probleme machen
        maxAge: 7 * 24 * 60 * 60 * 1000 // ← Wichtig: Expiry setzen!
    })
    
    res.status(201).json({
        user: {
            username: user.userName,
            email: user.email,
            role: user.role
        },
        accessToken
    })
<<<<<<< HEAD

    logger.info('User registred successfully', {
            username: userName,
            email: email,
            role: role
    })
=======
>>>>>>> tests
})

export default register