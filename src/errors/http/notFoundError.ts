import { httpError } from "./httpError";
import { Request } from 'express'

export const notFound = (req: Request, message = 'Not found', context: Record<string, unknown> = {}) =>
  httpError({
    req,
    message,
    context,
    statusCode: 404,
    code: 'NOT_FOUND',
    action: 'REQUEST'
  });

  export default notFound