import { httpError } from "./httpError";

export const forbidden = (req: Request, message = 'Access denied') =>
  httpError({
    req,
    message,
    statusCode: 403,
    code: 'FORBIDDEN',
    action: 'AUTHORIZATION'
  });