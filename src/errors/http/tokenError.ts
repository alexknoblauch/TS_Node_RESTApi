import { httpError } from "./httpError";
import { Request } from 'express'

const tokenError = function(req: Request, message = 'Invalid Token', context: Record<string, unknown> = {}) {
    httpError({
        req,
        message,
        context,
        statusCode: 401,
        code: 'INVALID_TOKEN',
        action: 'AUTHENTICATION'
    })
}

export default tokenError