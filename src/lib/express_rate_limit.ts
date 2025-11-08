
/**
 *  Node Modules
 */
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 60000,
    limit:60,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        error: 'you have sent too many requests, please try later'
    }
})

export default limiter