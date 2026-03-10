import { Request } from "express";
import { httpError } from "./httpError";

// => Arrow function (HOF)
const httpConflictError = function(req: Request, message: string, context: Record<string, unknown> = {}) {
    return httpError({
        req,
        message,
        context,
        statusCode: 409,
        code: 'HTTP_CONFLICT',
    })
}

export default httpConflictError