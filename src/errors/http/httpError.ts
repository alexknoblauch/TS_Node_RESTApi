import logger from "@/lib/winston";
import { Request } from 'express'
import HttpAppError from "./HTTPAppError";

type HttpErrorOptions = {
  req: Request;
  message: string;
  statusCode: number;
  context: Record<string, unknown>;
  code: string;
  action?: string;
  reason?: string;
};

export function httpError({
  req,
  message,
  statusCode,
  context,
  code,
  action = 'REQUEST',
  reason = code
}: HttpErrorOptions): never {

  const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

  
  logger.log(logLevel, message, {
    reason,
    action,
    context,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  throw new HttpAppError(message, statusCode, code, context, action, reason);
}
