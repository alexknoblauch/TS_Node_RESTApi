import { httpError } from "./httpError";
import { Request } from 'express'

// => Arrow function (HOF)
export const notFound = (req: Request, message = 'Not found', context: Record<string, unknown> = {}) =>
  httpError({
    req,
    message,
    context,
    statusCode: 404,
    code: 'NOT_FOUND',
  });

  export default notFound