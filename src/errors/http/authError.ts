import { httpError } from "./httpError";
import { Request } from 'express'


export const authError = (req: Request, message = 'Unauthorized') =>
  httpError({
    req,
    message,
    statusCode: 401,
    code: 'UNAUTHORIZED',
    action: 'AUTHENTICATION'
  });