import TokenError from "@/errors/service/common/TokenError";
import { userRepository } from "@/repository/userRepository/userRepository";
import { ensureDocument } from "@/utils/validation/ensureDocument";
import { NextFunction, Request, Response } from "express";
import crypto from 'crypto'

const passwordReset = async function(req: Request, res: Response) {
    const { token } = req.params 
    if(typeof token !== 'string'){return}  // array ausschliessen, unüblicher Fehler!
    const encryptedToken  = crypto.createHash('sha256').update(token).digest('hex') // post('/reset-password/:token', .....)

    const user = await userRepository.findDocumentByToken(encryptedToken)
    ensureDocument(user, 'User')

    user.password = req.body.password
    user.passwordResetToken = ''
    user.passwordResetTokenExpires = null
    await userRepository.save(user)
}

export default passwordReset