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
import  { AppError }  from "../../../types/express/express";

/**
 * Types
 */
import { Request, Response } from "express";
import { IUser } from "../../../models/user";
import { generateAccessToken, generateRefreshToken } from "../../../lib/jwt";

type LoginUser = Pick<IUser, 'password' | 'email'> & {
  twoFactorCode?: string;
}

const login = async function (req: Request, res: Response): Promise<void> {
  const { email, password, twoFactorCode } = req.body as LoginUser;

  if (!email || !password) {
    logger.error('Email and password required')
    const error = new Error('Email and password required') as AppError;
    error.statusCode = 400;
    error.code = 'EMAIL_PASSWORD_REQUIRED';
    throw error;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password') as AppError;
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const pwCompare = await bcrypt.compare(password, user.password);
  if (!pwCompare) {
    const error = new Error('Invalid email or password') as AppError;
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
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
      encoding: 'base32',
      token: twoFactorCode,
      window: 1 // 30s Toleranz
    });

    if (!verified) {
      const error = new Error('Invalid 2FA code') as AppError;
      error.statusCode = 401;
      error.code = 'INVALID_2FA_CODE';
      throw error;
    }
  }

  // 👇 DEIN ORIGINALER CODE (unverändert)
  const accessToken = await generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);

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