import sendEmail from '@/infra/mail/mailer.service'
import logger from '@/lib/winston'
import User from '@/models/user'
import authService from '@/services/auth.service'
import { ensureDocument } from '@/utils/validation/ensureDocument'
import { Request, Response, NextFunction } from 'express'

const passwordForgot = async function(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body
    const baseURL = `${req.protocol}//${req.get('host')}/api/v1/users/reset-password`

    const credentials = {email, baseURL}

    await authService.forgotpassword(credentials)

    res.status(200).json({
        message: 'Email successfully sent',
        email
    })
}

export default passwordForgot