/**
 *  Node Modules
*/
import express, {Application} from 'express'
import { initRedis } from './lib/redis'
import { Server } from 'http'

/**
 *  Node Modules
 */
import cors, { CorsOptions }  from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import helmet from 'helmet'

/**
 *  Custom Modules
*/
import config from './config'
import { connectToDatabase } from './lib/mongoose'
import logger from '@/lib/winston'

/**
 *  Middelware
*/
import { errorHandler } from './middleware/errorHandler'
import { correlationIdMiddleware } from './middleware/correlationId'

/**
 *  Router
*/
import v1Router from './routes/v1/index'
import initializeRateLimiter from './lib/express_rate_limit'
import unhandledRejectionHandler from './infra/server/unhandledRejectionHandler'
import uncaughtExceptionHandler from './infra/server/uncaughtExceptionHandler'
import notFoundMiddleware from './errors/http/notFoundMiddleware'

/**
 *  Server
*/
import gracefulShutdown from './infra/server/gracefulShutdown'


// Process
process.on('unhandledRejection', (reason, promise) => {
    if(server) unhandledRejectionHandler(server, reason, promise);
})
    
process.on('uncaughtException', (error) => {
    if(server) uncaughtExceptionHandler(server, error)
});



// Express App
const createApp = function(): Application{
    const app = express()

    const corsOptions: CorsOptions = {
        origin: config.CORS_ORIGINS,
    }

    app.use(correlationIdMiddleware)
    app.use(cors(corsOptions))
    app.use(compression({ threshold: 1024 }))
    app.use(helmet())

    app.use(express.json())                                 
    app.use(express.urlencoded({ extended: true }))         
    app.use(cookieParser())                                 
    //app.use(csrfProtection)  nur wenn SESSION ID   sonst route refresh-token logout csrf setzen
    return app
}


// Server 
let server: Server; 

const startServer = async() => {
    try {
        await connectToDatabase();
        await initRedis();
        
        const app = createApp()

        const limiter = initializeRateLimiter();
        app.use(limiter);

        app.use('/', v1Router);

        app.all('*', notFoundMiddleware);
        app.use(errorHandler);
        
        server = app.listen(config.PORT, () => {
            logger.info(`server lsitens at port ${config.PORT}`)

            process.on('SIGINT', () => gracefulShutdown(server));           // CB wichitg (wie bei React)
            process.on('SIGTERM', () => gracefulShutdown(server));          // CB wichitg (wie bei React)        });
        })
} catch (err) {
        logger.error('Error while Server connection', { err });              // { err } = MetaObject
        
        if (process.env.NODE_ENV === 'production') {
            process.exit(1)
        };
    }
}
startServer();



