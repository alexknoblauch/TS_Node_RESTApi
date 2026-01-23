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

// setup2FA
router.get('/2fa/setup',
 authenticate
)
// disable2FA
router.post('/2fa/disable',
    authenticate, 
);


router.post('/register', 
    validateAuthRegister(),
    validationErrorMiddelware,
    register
    )

router.post('/login',
    validateAuthLogin(),
    validationErrorMiddelware,
    login
) 

router.post('/refresh-token',
    validateAuthRefreshToken(),
    validationErrorMiddelware, 
    refreshToken
)

router.post('/logout',authenticate,  logout)


export default router