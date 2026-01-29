import { httpError } from "./httpError";
import { Request } from 'express'

const tokenError = function(req: Request, message = 'Invalid Token') {
    httpError({
        req,
        message,
        statusCode: 401,
        code: 'INVALID_TOKEN',
        action: 'AUTHENTICATION'
    })
}

export default tokenError