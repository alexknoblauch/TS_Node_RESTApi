import { httpError } from "./httpError";
import { Request } from 'express'

// => Arrow function (HOF)
export const forbidden = (req: Request, message = 'Access denied', context: Record<string, unknown> = {}) =>
  httpError({
    req,
    message,
    context,
    statusCode: 403,
    code: 'FORBIDDEN',
  });