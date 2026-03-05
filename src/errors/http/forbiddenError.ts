import { httpError } from "./httpError";
import { Request } from 'express'


export const forbidden = (req: Request, message = 'Access denied', context: Record<string, unknown> = {}) =>
  httpError({
    req,
    message,
    context,
    statusCode: 403,
    code: 'FORBIDDEN',
    action: 'AUTHORIZATION'
  });