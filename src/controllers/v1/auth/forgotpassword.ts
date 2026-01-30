import User from '@/models/user'
import { ensureDocument } from '@/utils/validation/ensureDocument'
import { Request, Response, NextFunction } from 'express'

const forgotpassword = async function(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body
    const user = await User.findOne(email)
    ensureDocument(user, 'User')

    const resetToken = user.generateResetPasswordToken()
    await user.save({validateBeforeSave: false})
}