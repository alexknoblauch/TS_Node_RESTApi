import { NextFunction, Request, Response } from "express";
import HttpAppError from "./HTTPAppError";

const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const error = new HttpAppError(`API endpoint ${req.method} ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
    next(error);
}

export default notFoundMiddleware