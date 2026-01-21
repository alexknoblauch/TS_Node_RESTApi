/**
 * Custom Modules
 */
import authService from "@/services/auth.service";
import catchAsync from "@/utils/catchAsync";
/**
 *  Types
 */

import type { Request, Response, NextFunction } from 'express'
<<<<<<< HEAD
import type { IUser } from "@/models/user";
import catchAsync from "@/utils/catchAsync";
import { ensureDocument } from "@/utils/ensureDocument";
=======
>>>>>>> tests

const login = catchAsync(async(req: Request, res: Response) => {
            const credentials = req.body                           // Achtung: kein destructoring
            const {accessToken, refreshToken} = await authService.login(credentials) 

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Tage
            })

<<<<<<< HEAD
const login = catchAsync(async function(req: Request, res: Response): Promise<void>{
    const {email, password} = req.body as UserData
    const user = await  User.findOne({email}).select('email username password role').lean().exec()

    ensureDocument(user, 'User')

    const pwCorrect = await bcrypt.compare(password, user.password)

    if(!pwCorrect){
        res.status(404).json({
            message: 'wrong password'
        })
        return
    }
    
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    await Token.create({token: refreshToken, userId: user._id})
    
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // ← In Development = false
        sameSite: 'lax', // ← 'strict' kann auch Probleme machen
        maxAge: 7 * 24 * 60 * 60 * 1000 // ← Wichtig: Expiry setzen!
    })
    

    logger.info('user successfully logged in', user)

    res.status(200).json({
        user: {
            username: user.userName,
            email: user.email,
            role: user.role
        },
        accessToken
    })
=======
            res.status(200).json({
                accessToken,
            })
>>>>>>> tests
})

export default login