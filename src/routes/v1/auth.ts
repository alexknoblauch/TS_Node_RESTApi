/**
 *  Node Modules
 */

import { Router } from 'express'
import { body, cookie } from 'express-validator'
import bcrypt from 'bcrypt'

/**
 *  Custom Modules
 */
import  User, { IUser }  from '@/models/user'
import  login from '@/controllers/v1/auth/login'
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
//import { setup2FA } from '../controller/auth/login' 

/**
 *  Models
 */

const router = Router()

router.get('/2fa/setup',
 // authenticate,  User muss eingeloggt sein!
 // setup2FA
)
router.post('/2fa/disable', 
    //authenticate, 
    // disable2FA
);



router.post('/register', 
    body('email')
    .trim()
    .notEmpty()
    .withMessage('emai must have a value')
    .isLength({max: 50})
    .withMessage('Email must have less than 50 chars')
    .isEmail()
    .withMessage('Must be valid Email')
    .custom(async function(value){
        const existing = await User.exists({'email': value})
        if(existing){
            throw new Error('Email already is registrated')
        }
    }), 
    body('password')
    .notEmpty()
    .withMessage('Please fill in your passwort')
    .isLength({min: 8})
    .withMessage('Password must have min 8 character'),
    body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(['admin', 'user'])
    .withMessage('Role must be or admin or user'),
validationErrorMiddelware,
register)

router.post('/login',body('email')
    .trim()
    .notEmpty()
    .withMessage('emai must have a value')
    .isLength({max: 50})
    .withMessage('Email must have less than 50 chars')
    .isEmail()
    .withMessage('Must be valid Email')
    .custom(async function(value, { req }){            // ACHTUNG req in { } sonst gehts nicht! destructoring! req, location, path, parent, siblings 
        const { password } = req.body; 
        const user = await User.findOne({email: value}).select('password').lean() as IUser | null
        if(!user){
            throw new Error('User is not found')
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch){
            throw new Error('password is wrong')
        }
    }), 
    body('password')
    .notEmpty()
    .withMessage('Please fill in your passwort')
    .isLength({min: 8})
    .withMessage('Password must have min 8 character'),
    validationErrorMiddelware,
     login)

router.post('/refresh-token',
    cookie('refreshToken')
    .notEmpty()
    .withMessage('Token is empty')
    .isJWT()
    .withMessage('Invalid Token'),
    validationErrorMiddelware, 
refreshToken)

router.post('/logout',authenticate,  logout)


export default router