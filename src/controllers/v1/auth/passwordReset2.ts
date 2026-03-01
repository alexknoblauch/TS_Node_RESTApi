import { Request, Response } from "express";
import crypto from 'crypto'
import { userRepository } from "@/repository/userRepository/userRepository";
import UserNotFound from "@/errors/service/user/UserNotFound";

const passwordReset = async function (req: Request, res: Response):Promise<void> {
    const {token} = req.params

    const hashedToken = crypto.createHash('sha256').update(token).digest().toString('hex')
    const user = await userRepository.findDocumentByToken(hashedToken)
    if(!user) throw new UserNotFound()

    user.password = req.body
    user.passwordResetToken = ''
    user.passwordResetTokenExpires = null
    await userRepository.save(user)

}