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
import AppError from "@/errors/service errors/AppError";
import { ensureDocument } from "@/utils/validation/ensureDocument";
import { badRequest } from "@/utils/Error files/badRequestError";
import { authError } from "@/utils/Error files/authError";

type LoginUser = Pick<IUser, 'password' | 'email'> & {
  twoFactorCode?: string;
}

const login = async function (req: Request, res: Response): Promise<void> {
  const { email, password, twoFactorCode } = req.body as LoginUser;

  if (!email || !password) {
    badRequest(req, 'Email or Password wrong')
  }

  const user = await User.findOne({ email });
  ensureDocument(user, 'User')

  const pwCompare = await bcrypt.compare(password, user.password);
  if (!pwCompare) {
    authError(req, 'Email or Password wrong')
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
      logger.info('Twofactor authentication failed', {
        reason: 'TWOFACTOR_ATUH_FAILED',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        action: '"2FA_AUTH_ATTEMPT'
      })
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