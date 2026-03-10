import { generateAccessToken } from "@/lib/jwt";
import { userRepository } from "@/repository/userRepository/userRepository";
import { Request, Response } from "express";

const refreshToken = async function(req: Request, res: Response) {
    const {refreshToken} = req.cookies

    const accessToken = await userService.refreshtToken(refreshToken)
}