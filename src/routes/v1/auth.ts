/**
 *  Node Modules
 */

import { Router } from 'express'


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
import sendEmail from '@/infra/mail/mailer.service'
import passwordForgot from '@/controllers/v1/auth/passwordForogt'
import passwordReset from '@/controllers/v1/auth/passwordReset'
import passwordChange from '@/controllers/v1/auth/passwordChange'
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

router.post('/logout', authenticate, logout)

router.post('/forgot-password', passwordForgot)         //keine middelware; muss öffentliche route sein
router.patch('/reset-password/:token', passwordReset)   //keine middelware; muss öffentliche route sein
router.post('/change-password', authenticate, passwordChange)

export default router