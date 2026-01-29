import logger from "@/lib/winston";
import { Request } from 'express'
import AppError from "../service/AppError";

type HttpErrorOptions = {
  req: Request;
  message: string;
  statusCode: number;
  code: string;
  action?: string;
  reason?: string;
};

export function httpError({
  req,
  message,
  statusCode,
  code,
  action = 'REQUEST',
  reason = code
}: HttpErrorOptions): never {
  logger.info(message, {
    reason,
    action,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  throw new AppError(message, statusCode, code);
}
