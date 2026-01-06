import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { Token } from "@/models/token2";
import { ensureDocument } from "@/utils/ensureDocument";
import { validateRequired } from "@/utils/validateRequired";
import { Request, Response } from "express";

const refreshToken2 = function(req: Request, res: Response){
    const refreshToken = req.cookies.refreshToken

    validateRequired(refreshToken, 'RefreshToken')

    const token = Token.exists({token: refreshToken})

    ensureDocument(token, 'Token')

    const paylaod = verifyRefreshToken(refreshToken)

    const accessToken = generateAccessToken(paylaod.userId)
}