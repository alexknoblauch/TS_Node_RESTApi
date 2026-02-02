import logger from "@/lib/winston"
import HttpAppError from "./HTTPAppError"

interface IHttpError {
    req: Request
    message: string,
    statusCode: number
    code: string,
    action?: string,
    reason?:string
}

export const httpError = function({
    req,
    message,
    statusCode,
    code,
    action,
    reason
}: IHttpError): never {
    logger.error({
        message,
        statusCode,
        code,
        action,
        reason,
        path: req.url
        method: req.method
    })

    throw new HttpAppError(message, statusCode, code)
}