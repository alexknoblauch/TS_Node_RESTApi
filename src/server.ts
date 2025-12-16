
/**
 *  Node Modules
*/
import express, {Request, Response, Application, urlencoded} from 'express'
import { redisClient } from './lib/redis'

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
import { errorHandler } from './middleware/errorHandler'

/**
 *  Router
*/
import v1Router from './routes/v1/index'
import { correlationIdMiddleware } from './middleware/correlationId'
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
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compression({ treshold: 1024 }))
app.use(helmet())
app.use('/', v1Router)
app.use(errorHandler)

// Server
const startServer = async() => {
    try {
        await connectToDatabase()
        await redisClient.connect();

        const limiter = initializeRateLimiter();
        app.use(limiter)

        app.listen(config.PORT, () => {
            logger.info(`server lsitens at port ${config.PORT}`)
        })
    } catch(err) {
        logger.error('server not connected')
        
        if (process.env.NODE_ENV === 'production') {
            process.exit(1)
        }
    }
}
startServer()


const handleShutDown = async function(){
    try {
        await disconnectDatabase()

        logger.info('server shut down')
        process.exit(0)
    } catch(err) {
        logger.error('error during server shutdown')
    }
}


process.on('SIGINT', handleShutDown)
process.on('SIGTERM', handleShutDown)

