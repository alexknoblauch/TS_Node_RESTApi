/**
 * Custom Models
 */ 

import catchAsync from '../../../utils/async/catchAsync';
/**
 * Types
 */ 

import type {Request, Response} from 'express'
import type { UserRegister } from '@/models/user'
import authService from '@/services/auth.service'


const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const credentials = req.body as UserRegister

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