/**
 * Custom Models
 */ 

import catchAsync from '../../../utils/async/catchAsync';
/**
 * Types
 */ 

import type {Request, Response} from 'express'
import authService from '@/services/auth.service'
import { createUserSchema } from '@/dto/user/createUser';


const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const credentials = createUserSchema.parse(req.body)

    const {accessToken, refreshToken} = await authService.register(credentials)
                
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // ← In Development = false
        sameSite: 'lax', // ← 'strict' kann auch Probleme machen
        maxAge: 7 * 24 * 60 * 60 * 1000 // ← Wichtig: Expiry setzen!
    })
    
    res.status(201).json({
        accessToken
    })
})

export default register