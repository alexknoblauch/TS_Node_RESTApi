import HttpAppError from "@/errors/http/HTTPAppError"
import { NextFunction, Request, Response } from "express"

const isHttpError = function(err: unknown): err is HttpAppError {
    return err instanceof HttpAppError
}

const errorhandler = function(err: unknown, req: Request, res: Response, next: NextFunction){
    if(process.env.NODE_ENV === 'development'){
        if (isHttpError(err) && err.isOperational){
            return res.status(err.statusCode).json({
                message: err.message,
                code: err.code,
                action: err.action,
                reason: err.reason,
                err
            })
        } 
            return res.status(500).json({
                message: 'Server Error'
            })
        
    } else if (process.env.NODE_ENV === 'production'){
        (isHttpError(err) && err.isOperational){
            return res.status(err.statusCode).json({
                message: err.message
            })
        } 
    } else {
            return res.status(500).json({
                message: 'Server Error'
            })
        }
}