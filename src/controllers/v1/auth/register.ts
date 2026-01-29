/**
 * Custom Models
 */ 
import logger from '@/lib/winston'
import  { genUsername }  from '@/utils/index'
import { generateAccessToken, generateRefreshToken} from '@/lib/jwt'
import Token from '@/models/token'
import config from '@/config'
import catchAsync from '../../../utils/async/catchAsync';

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
    const credentials = req.body as UserData

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
})

export default register