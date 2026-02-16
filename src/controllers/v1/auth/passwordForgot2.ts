import authService from "@/services/auth.service";
import { Request, Response } from "express";

const passwordForgot = async function(req: Request, res: Response): Promise<void> {
    const email = req.body
    const baseURL = `${req.protocol}//${req.get('host')}/api/v1/users/reset-password`

    const credentials = {email, baseURL}

    const token = authService.passwordForgot2(credentials)
}