
/**
 *  Node Modules
 */
import { rateLimit } from 'express-rate-limit'
import RedisStore from 'rate-limit-redis';
import { redisClient } from './redis';

const initializeRateLimiter = () => {
    let store
    
    if (!redisClient.isOpen) {
        throw new Error('Redis required for rate limiting');
    }

    try {
        store = new RedisStore({
            sendCommand: (...args: string[]) => redisClient.sendCommand(args),
        })
    } catch(err){
        console.log(`Redis Store failed, ${err}`)
        throw new Error('Redis Store initialization failed - cannot use memory fallback');
    }

    const limiter = rateLimit({
        store,
        windowMs: 15 * 60 * 1000, 
        limit: 100,
        standardHeaders: true,
        message: {
            success: false,
            error: 'Too many requests from this IP'
        }
    });

    return limiter
}

export default initializeRateLimiter;