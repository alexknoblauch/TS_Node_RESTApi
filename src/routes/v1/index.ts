
/**
 * Node Modules
*/
import { Router } from 'express'
/**
 * AuthRoute
*/
import authRoutes from '@/routes/v1/auth'
import userRoutes from '@/routes/v1/user'
import blogRoutes from '@/routes/v1/blog'
import likeRoutes from '@/routes/v1/like'
import commentRoutes from '@/routes/v1/comment'
import testRouter from '@/routes/v1/testRouter'


/**
 * Types
*/
import mongoose ,{ Types } from 'mongoose'
import {Request, Response} from 'express'
/**
 * Root Route
*/
const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'API is live',
        status: 'ok',
        version: '1.0.0',
        docs:'currently not available',
        timestamp: new Date().toISOString()
    })
})

/**
 * Routes
*/
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/blogs', blogRoutes)
router.use('/likes', likeRoutes)
router.use('/comments', commentRoutes)
router.use('/test', testRouter)


export default router