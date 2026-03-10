import HttpAppError from "@/errors/http/HTTPAppError";
import ServiceAppError from "@/errors/service/ServiceAppError";
import logger from "@/lib/winston";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";


const isHttpError = function(err: Error): err is HttpAppError {
    return err instanceof HttpAppError
}

const isServiceError = function(err: Error): err is ServiceAppError {
    return err instanceof ServiceAppError
} 

const errorHandler = function(err: unknown, req: Request, res: Response, next: NextFunction) {

    logger.error('')

    if(err instanceof ZodError){
        err = new HttpAppError(
            'Validate Error',
             400,
             'ZOD_ERROR'
        )
    }
}