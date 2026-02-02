import { userRepository } from "@/repository/userRepository/userRepository";
import { ensureDocument } from "@/utils/validation/ensureDocument";
import { validateRequired } from "@/utils/validation/validateRequired";
import { NextFunction, Request } from "express";

const passwordChange = async function (req: Request, res: Response, next: NextFunction) {
    const userId = req.userId
    validateRequired(req, userId, 'userId')

    const user = await userRepository.findById(userId)
    ensureDocument(user, 'user')

    user.password = req.body.password
    userRepository.save(user)
}