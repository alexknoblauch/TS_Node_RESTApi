import { httpError } from "./httpError";
import { Request } from 'express'

// => Arrow function (HOF)
export const badRequest = (req: Request, message: string, code = 'BAD_REQUEST', context: Record<string, unknown> = {}) =>
  httpError({
    req,
    message,
    context,
    statusCode: 400,
    code,
  });