import { ensureDocument } from "@/utils/validation/ensureDocument";
import { httpError } from "./httpError";
import { Request } from 'express'

// => Arrow function (HOF)
export const authError = (req: Request, message = 'Unauthorized', context: Record<string, unknown> = {}) =>
  httpError({
    req,
    message,
    context,
    statusCode: 401,
    code: 'UNAUTHORIZED',
  });