import { userRepository } from "@/repository/userRepository/userRepository";
import authService from "@/services/auth.service";
import catchAsync from "@/utils/async/catchAsync";
import { validateRequired } from "@/utils/validation/validateRequired";
import { Request, Response } from "express";

const passwordForgot2 = catchAsync(async(req: Request, res: Response) => {
    const {email} = req.body
    validateRequired(req, email, 'email')

    const token = await authService.forgotpassword(email)
})