/**
 * Node Modules
 */

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

/**
 * Types
 */
import { Response, Request, Router } from 'express'
import { config } from 'dotenv'
import validateCurrentUser from '@/middleware/validate/user/validateCurrentUser'
import validateGetUser from '@/middleware/validate/user/validateGetUser'
import validateDeleteUserById from '@/middleware/validate/user/validateDeleteUserById'


const router = Router()

router.get('/', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
    const limitRaw = Number(req.query.limit);
    const offsetRaw = Number(req.query.offset);

    const limit = Number.isInteger(limitRaw) && limitRaw > 0 ? limitRaw : 10;
    const offset = Number.isInteger(offsetRaw) && offsetRaw >= 0 ? offsetRaw : 0;

    const users = await getAllUsers(limit, offset)

    res.status(200).json({
        code: 'Success',
        message: 'Users retreived successfully',
        users,
        limit,
        offset,
    })
})

router.get('/current', authenticate, authorize(['admin', 'user']), 
    async(req: Request, res: Response) => {
        const userId = req.userId

        if(!userId) {
            return res.status(401).json({
                code: 'Unauthorized',
                message: 'User not authenticated'
            })
        }
        
        const user = await getCurrentUser(userId)

        res.status(200).json({
            message: 'User successfully retreived',
            status: 200,
            user
        })
    }
)

router.put('/current', authenticate, authorize(['admin', 'user']),
validateCurrentUser(),
    async(req: Request, res: Response) => {

        const userId = req.userId

        
        if(!userId) {
            return res.status(401).json({
                code: 'Unauthorized',
                message: 'User not authenticated'
            })
        }
        
        const updatedData = req.body

        const user = await updateCurrentUser(userId, updatedData)

        res.status(200).json({
            message: 'User successfully created',
            status: 200,
            user
        })
    }
)

router.delete('/current', authenticate, authorize(['admin', 'user']),
    async(req: Request, res: Response) => {
        const userId = req.userId

        if(!userId) {
            return res.status(401).json({
                code: 'Unauthorized',
                message: 'User not authenticated'
            })
        }
        
        await deleteUser(userId)

        res.status(204)
    }
)


router.get('/:userId', authenticate, authorize(['admin', 'user']), 
validateGetUser(),
validationErrorMiddelware , 
    async(req: Request, res: Response) => {
        const userId = req.params.userId

        if(!userId) {
            return res.status(401).json({
                code: 'Unauthorized',
                message: 'User not authenticated'
            })
        }

        const user = await getUser(userId)

        
        res.status(200).json({
            code: 'Success',
            message: 'User successfully retreaved.',
            user
        })
    }
)

export default router
