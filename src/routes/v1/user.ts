/**
 * Node Modules
 */

import { Request, Response, Router } from 'express'
import { param, query, body } from 'express-validator'

/**
 * Middleware
 */

import authenticate from '@/middleware/authenticate'
import validationErrorMiddelware from '@/middleware/validationError'
import authorize from '@/middleware/authorize'
import updateUserValidator from '@/middleware/validators/updateUserValidator'

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



import 'express-async-errors';          //Automatisches try catch für express router!! 


// wenn Express abstraheirt wird läuft catchAsync nicht mehr im Controller weil es next() Express braucht!!
const router = Router()

router.get('/', authenticate, authorize(['admin']), getAllUsers)

router.get('/current', authenticate, authorize(['admin', 'user']), 
    async (req: Request, res: Response) => {
        const userId = req.userId

        if(!userId) return res.status(401).json({ message: 'Unauthenticated' })

        const user = await getCurrentUser(userId.toString())

        res.status(200).json({
            success: true,
            data: user,
            message: 'User updated successfully'
        });    
    }
);

router.put('/current', authenticate, authorize(['admin', 'user']), updateUserValidator(),
validationErrorMiddelware , 
    async(req: Request, res: Response) => {
        const userId = req.userId

        if(!userId) throw Error(`${userId} not found`)

        const {
            username,
            password,
            email,
            firstName,
            lastName,
            website,
            youtube,
            facebook,
            instagram,
            linkedin,
            x
        } = req.body
    
        const updatedUser = await updateCurrentUser(userId.toString(), username, password, email, firstName, lastName, website, youtube, facebook, instagram, linkedin, x )
        
        res.status(200).json({
            success: true,
            data: {
                user: updatedUser
            },
            message: 'User updated successfully'
        });
    })


router.delete('/current', authenticate, authorize(['admin', 'user']),
    async (req: Request, res: Response) => {
        const id  = req.userId?.toString()
        
        if(!id) throw Error(`Id is wrong ${id}`)

        await deleteUser(id)

        res.status(204)
    })



router.get('/:userId', authenticate, authorize(['admin', 'user']), param('userId')
    .notEmpty().isMongoId().withMessage('ID mus be a Mongo UserId'), 
    validationErrorMiddelware,
    async(req: Request, res: Response) => {
        const userId = req.params.userId

        const user = await getUser(userId)

        res.status(200).json({
            code: 'Success',
            message: 'User successfully retreaved.',
            user
        })
    } )

router.delete('/:userId', authenticate, authorize(['admin', 'user']), 
param('userId').notEmpty().isMongoId().withMessage('ID mus be a Mongo UserId'), 
validationErrorMiddelware, 
    async(req: Request, res: Response) => {
        const userId = req.params.userId
        
        await deleteUserById(userId)

        
        res.status(204)
    }
)

export default router
