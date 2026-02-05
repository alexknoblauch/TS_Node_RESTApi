import { Request } from "express";
import { httpError } from "./httpError";

const authError = function(req: Request, message: string) {
    httpError({
        req,
        message: 'Invalid Email oder Password',
        statusCode: 401,
        code: 'UNAUTHORIZED',
        action: 'AUTH',
        reason: 'EMAIL_PASSWORD_INVALID'
    })
}