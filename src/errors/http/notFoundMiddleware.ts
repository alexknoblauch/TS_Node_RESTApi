import { NextFunction, Request, Response } from "express";

const notFoundMiddleware = (req: Request, res: Response, next: NextFunction => {
    const error = new HTTPAppError(`API endpoint ${req.method} ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
    next(error);
})

export default notFoundMiddleware