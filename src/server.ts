/**
 *  Node Modules
*/
import express, {Request, Response, Application, urlencoded, NextFunction} from 'express'
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
import { serverClose } from './infra/server/serverClose'
import AppError from './errors/service/ServiceAppError'


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
app.use(compression({ threshold: 1024 }))
app.use(helmet())
app.use(csrfProtection)                                 //2

app.use(express.json())                                 
app.use(express.urlencoded({ extended: true }))         


// Server
let server: Server; 

const startServer = async() => {
    try {
        await connectToDatabase();
        await redisClient.connect();
        
        const limiter = initializeRateLimiter();
        app.use(limiter);

        app.use('/', v1Router);
        
        server = app.listen(config.PORT, () => {
            logger.info(`server lsitens at port ${config.PORT}`)
        });
        
        
        process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
            logger.error('UNHANDLED REJECTION! Shutting down...', {     //Rejected Promise = inkonsisenz
                reason: reason?.message || reason,
                stack: reason?.stack,
                promise
            });
            
            serverClose(server, 'Process terminated due to unhandled rejection')    //Harter Exit
        });
        
        
        process.on('uncaughtException', (error: Error) => {             //Error ohne handler
            logger.error('UNCAUGHT EXCEPTION! Shutting down...', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            serverClose(server, 'Process terminated due to uncaught exception')     //Harter Exit
        });
    } catch (err) {
        logger.error('server not connected');
        
        if (process.env.NODE_ENV === 'production') {
            process.exit(1)
        };
    }
}
startServer();




//ERROR HANDLING
app.use('/api/*', (req: Request, res: Response, next: NextFunction) => {
    const error = new AppError(`API endpoint ${req.method} ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
    next(error);
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const error = new AppError(`API endpoint ${req.method} ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
    next(error);
});

app.use(errorHandler);




//EXIT PROCESS
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

