/**
 * Models
 */
import User from "../../../models/user";
import speakeasy from 'speakeasy';

/**
 * Node Modules
 */
import bcrypt from 'bcrypt'

/**
 * Custom Modules
 */
import logger from '../../../lib/winston'

/**
 * Types
 */
import { Request, Response } from "express";
import { IUser } from "../../../models/user";
import { generateAccessToken, generateRefreshToken } from "../../../lib/jwt";
import AppError from "@/utils/AppError";
import { ensureDocument } from "@/utils/ensureDocument";

type LoginUser = Pick<IUser, 'password' | 'email'> & {
  twoFactorCode?: string;
}

const login = async function (req: Request, res: Response): Promise<void> {
  const { email, password, twoFactorCode } = req.body as LoginUser;

  if (!email || !password) {
    logger.info('Invalid email or password', {
      reason: 'USER_NOT_FOUND_OR_PASSWORD_INVALID',
      email: email,         
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      action: 'LOGIN_ATTEMPT'
    })
    throw new AppError('Email and password required', 400, 'EMAIL_PASSWORD_REQUIRED');
  }

  const user = await User.findOne({ email });
  ensureDocument(user, 'User')

  const pwCompare = await bcrypt.compare(password, user.password);
  if (!pwCompare) {
    logger.info('Invalid email or password', {
      reason: 'USER_NOT_FOUND_OR_PASSWORD_INVALID',
      email: email,         
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      action: 'LOGIN_ATTEMPT'
    })
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // 2FA CHECK - NUR DIESEN TEIL HINZUGEFÜGT

  // npm install speakeasy qrcode
  // npm install -D @types/speakeasy @types/qrcode 

  if (user.twoFactorEnabled && user.twoFactorSecret) {              // 2fa arbeitet mit if statement
    if (!twoFactorCode) {
      // Frontend soll 2FA Code anfordern
      res.status(200).json({
        requires2FA: true,
        message: "2FA code required"
      });
      return;
    }

    // 2FA Code verifizieren
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      token: twoFactorCode,
      encoding: 'base32',
    });

    if (!verified) {
      const error = new Error('Invalid 2FA code') as AppError;
      error.statusCode = 401;
      error.code = 'INVALID_2FA_CODE';
     throw new AppError('Invalid 2FA code', 401, 'INVALID_2FA_CODE');
    }
  }

  // 👇 DEIN ORIGINALER CODE (unverändert)
  const accessToken =  generateAccessToken(user.id);
  const refreshToken =  generateRefreshToken(user.id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict'
  });

  res.status(200).json({
    success: true,
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      twoFactorEnabled: user.twoFactorEnabled
    }
  });
}

export default login;