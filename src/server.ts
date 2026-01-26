/**
 *  Node Modules
*/
import express, {Request, Response, Application, urlencoded} from 'express'
import { redisClient } from './lib/redis'
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
import { connectToDatabase, disconnectDatabase } from './lib/mongoose'
import logger from '@/lib/winston'

/**
 *  Middelware
*/
import { errorHandler } from './middleware/errorHandler'
import { csrfProtection } from './middleware/csrfProtection'
import { correlationIdMiddleware } from './middleware/correlationId'

/**
 *  Router
*/
import v1Router from './routes/v1/index'
import initializeRateLimiter from './lib/express_rate_limit'


/**
 *  Express App
 */
export const app: Application = express()


//Configure CORS options
const corsOptions: CorsOptions = {
 origin: true
}


// Middleware
app.use(correlationIdMiddleware)
app.use(cors(corsOptions))
app.use(cookieParser())                                 //1
app.use(express.json())                                 //2
app.use(express.urlencoded({ extended: true }))         //3
app.use(compression({ threshold: 1024 }))
app.use(helmet())
app.use(csrfProtection)                                 //4


// Server
let server: Server; 

const startServer = async() => {
    try {
        await connectToDatabase();
        await redisClient.connect();
        
        const limiter = initializeRateLimiter();
        app.use(limiter);

        app.use('/', v1Router);
        app.use(errorHandler);

        server = app.listen(config.PORT, () => {
            logger.info(`server lsitens at port ${config.PORT}`)
        });

                
        process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
            logger.error('🔴 UNHANDLED REJECTION! Shutting down...', {
                reason: reason?.message || reason,
                stack: reason?.stack,
                promise
            });
        
            server.close(() => {
                logger.error('Process terminated due to unhandled rejection');
                process.exit(1);
            });
        });


        process.on('uncaughtException', (error: Error) => {
            logger.error('🔴 UNCAUGHT EXCEPTION! Shutting down...', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
        
            server.close(() => {
                logger.error('Process terminated due to uncaught exception');
                process.exit(1);
            });
        });
    } catch(err) {
        logger.error('server not connected');
        
        if (process.env.NODE_ENV === 'production') {
            process.exit(1)
        };
    }
}
startServer();



const handleShutDown = async function(){
    try {
        await disconnectDatabase();

        logger.info('server shut down');
        process.exit(0);
    } catch(err) {
        logger.error('error during server shutdown');
    }
}




process.on('SIGINT', handleShutDown);
process.on('SIGTERM', handleShutDown);

