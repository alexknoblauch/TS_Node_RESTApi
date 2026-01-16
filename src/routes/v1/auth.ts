/**
 *  Node Modules
 */

import { Request, Response, Router } from 'express'
import { body, cookie } from 'express-validator'
import bcrypt from 'bcrypt'

/**
 *  Custom Modules
 */
import  User, { IUser }  from '@/models/user'
import  logout from '@/controllers/v1/auth/logout'



/**
 * Middleware
 */
import { refreshToken } from '@/controllers/v1/auth/refresh-token'

/**
 * Controllers
 */
import register  from '@/controllers/v1/auth/register'
import validationErrorMiddelware from '@/middleware/validationError'
import authenticate from '@/middleware/authenticate'
import validateAuthRegister from '@/middleware/validate/auth/validateAuthRegister'
import validateAuthLogin from '@/middleware/validate/auth/validateAuthLogin'
import login from '@/controllers/v1/auth/login'
import validateAuthRefreshToken from '@/middleware/validate/auth/validateAuthRefreshToken'
/**
 *  Models
 */

const router = Router()
router.post('/register', 
    validateAuthRegister(),
    validationErrorMiddelware,
        async(req: Request, res: Response) => {
            const {email} = req.body as UserData

        const {} = await register(email)

                    
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
        }
    )

router.post('/login',
    validateAuthLogin(),
    validationErrorMiddelware,
    login
    ) 

router.post('/refresh-token',
    validateAuthRefreshToken(),
    validationErrorMiddelware, 
refreshToken)

router.post('/logout',authenticate,  logout)


export default router