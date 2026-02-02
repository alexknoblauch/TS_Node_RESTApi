import { ensureDocument } from "@/utils/validation/ensureDocument";
import { httpError } from "./httpError";
import { Request } from 'express'
import sendEmail from "@/infra/mail/mailer.service";
import user from "@/models/user";


export const authError = (req: Request, message = 'Unauthorized') =>
  httpError({
    req,
    message,
    statusCode: 401,
    code: 'UNAUTHORIZED',
    action: 'AUTHENTICATION'
  });