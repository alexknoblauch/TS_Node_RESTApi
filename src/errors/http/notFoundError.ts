import { httpError } from "./httpError";
import { Request } from 'express'

export const notFound = (req: Request, message = 'Not found') =>
  httpError({
    req,
    message,
    statusCode: 404,
    code: 'NOT_FOUND',
    action: 'REQUEST'
  });

  export default notFound