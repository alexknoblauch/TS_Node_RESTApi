import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { correlationIdMiddleware } from './middleware/correlationId'

import { Server } from 'http'
import uncaughtExceptionHandler from './infra/server/uncaughtExceptionHandler'
import unhandledRejectionHandler from './infra/server/unhandledRejectionHandler'
import { createTestAccount } from 'nodemailer'
import { process } from 'zod/v4/core'
import gracefulShutdown from './infra/server/gracefulShutdown'
import router from './routes/v1'
import notFoundMiddleware from './errors/http/notFoundMiddleware'
import { errorHandler } from './middleware/errorHandler'
import { connectToDatabase } from './lib/mongoose'
import { initRedis } from './lib/redis'

process.on('uncaughtException', (error: Error) => {
    if(server) uncaughtExceptionHandler(server, error)
})

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    if(server) unhandledRejectionHandler(server, reason, promise)
})

const createApp = function() {
    const app = express()

    const corsOprions = {}

    app.use(correlationIdMiddleware)
    app.use(cors(corsOprions))
    app.use(helmet())
    
    
    app.use(cookieParser())
    app.use(express.urlencoded())
    app.use(express.json())

    return app
}


let server: Server

const createServer = async function(){
    try {
        await connectToDatabase()
        await initRedis()

        const app = createApp()

        const limiter = initializeRateLimiter()
        app.use(limiter)


        app.use('/', router)
        app.use('*', notFoundMiddleware)
        app.use(errorHandler)

         server = app.listen(3000, () => {
            logger.info('server ist listen 300')

            process.on('SIGTERM', gracefulShutdown(server))
            process.on('SIGINT', gracefulShutdown(server))
        })

    } catch(err){
            logger.error('error while server start')

            process.exit(0)
    }
}
createServer()
