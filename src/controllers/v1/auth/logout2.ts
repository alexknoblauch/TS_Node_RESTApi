import { generateAccessToken, verifyRefreshToken } from "@/lib/jwt"
import { ensureDocument } from "@/utils/ensureDocument"
import { validateRequired } from "@/utils/validateRequired"
import { Request, Response } from "express"

const logout = async function(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.cookies.refreshToken

    validateRequired(refreshToken, 'Refreshtoken')

    res.clearCookie('refreshToken')
    
    res.status(204)
    


}