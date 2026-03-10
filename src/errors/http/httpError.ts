import logger from "@/lib/winston";
import { Request } from 'express'
import HttpAppError from "./HTTPAppError";

type HttpErrorOptions = {
  req: Request;
  message: string;
  statusCode: number;
  context: Record<string, unknown>;
  code: string;

};

export function httpError({
  req,
  message,
  statusCode,
  context,
  code,
}: HttpErrorOptions): never {

  const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

  
  logger.log(logLevel, message, {
    context,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  throw new HttpAppError(message, statusCode, code, context);
}
