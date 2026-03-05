import { Request } from "express";
import { httpError } from "./httpError";

const httpConflictError = function(req: Request, message: string, context: Record<string, unknown> = {}) {
    return httpError({
        req,
        message,
        context,
        statusCode: 409,
        code: 'HTTP_CONFLICT',
        action: 'CONFLICT',
        reason: 'CONFLICT'
    })
}

export default httpConflictError