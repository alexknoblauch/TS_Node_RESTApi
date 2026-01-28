import { httpError } from "./httpError";

export const badRequest = (req: Request, message: string, code = 'BAD_REQUEST') =>
  httpError({
    req,
    message,
    statusCode: 400,
    code,
    action: 'VALIDATION'
  });