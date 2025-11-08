/**
 * Node Modules
 */

import { Router } from 'express'
import { param, query, body } from 'express-validator'

/**
 * Middleware
 */

import authenticate from '@/middleware/authenticate'
import validationErrorMiddelware from '@/middleware/validationError'
import authorize from '@/middleware/authorize'

/**
 * Models
 */
import User from '@/models/user'

/**
 * Controller
 */

import getCurrentUser from '@/controllers/v1/user/getCurrentUser'
import updateCurrentUser from '@/controllers/v1/user/updateCurrentUser'
import deleteUser from '@/controllers/v1/user/deleteUser'
import getAllUsers from '@/controllers/v1/user/getAllUsers'
import getUser from '@/controllers/v1/user/getUser'
import deleteUserById from '@/controllers/v1/user/deleteUserById'



const router = Router()

router.get('/', authenticate, authorize(['admin']), getAllUsers)

router.get('/current', authenticate, authorize(['admin', 'user']), getCurrentUser)

router.put('/current', authenticate, authorize(['admin', 'user']),
body('username')
.optional()
.trim()
.isLength({max: 20})
.withMessage('Username must be less than 20 chars')
.custom(async (value) => {
    const userExists = await User.exists({username: value})

    if(userExists){
        throw new Error('User already exists!')
    }
}),
body('email')
.optional()
.isLength({max: 50})
.withMessage('Email must be shorter than 50 Characters')
.isEmail()
.withMessage('Must be valid Email Adress')
.custom(async(value) => {
    const emailExists = await User.exists({email: value})

    if(emailExists){
        throw new Error('Email is already in use')
    }
}),
body('password')
.optional()
.isLength({min: 8})
.withMessage('Password min 8 Characters')
,body('firstName')
.optional()
.isLength({max: 30})
.withMessage('Firstname max 30 Characters'),
body(['website', 'facebook', 'instagram', 'x', 'linkedin'])
.optional()
.isURL()
.withMessage('Formate must be an URL')
.isLength({max: 100})
.withMessage('Characters not allowed succeed 100 chars') ,updateCurrentUser)

router.delete('/current', authenticate, authorize(['admin', 'user']), deleteUser)


router.get('/:userId', authenticate, authorize(['admin', 'user']), 
param('userId')
.notEmpty().isMongoId().withMessage('ID mus be a Mongo UserId'), validationErrorMiddelware , getUser)

router.delete('/:userId', authenticate, authorize(['admin', 'user']), 
param('userId')
.notEmpty().isMongoId().withMessage('ID mus be a Mongo UserId'), validationErrorMiddelware , deleteUserById)

export default router
