import { httpError } from "./httpError";
import { Request } from 'express'

// => Arrow function (HOF)
const tokenError = function(req: Request, message = 'Invalid Token', context: Record<string, unknown> = {}) {
    httpError({
        req,
        message,
        context,
        statusCode: 401,
        code: 'INVALID_TOKEN',
    })
}

export default tokenError