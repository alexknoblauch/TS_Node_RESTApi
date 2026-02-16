import { NextFunction, RequestHandler, Request, Response } from "express"

const catchAsync = function(fn: any) {
    return function(req: Request, res: Response, next: NextFunction) {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}