/**
 * Custom Modules
 */
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@/lib/jwt";
import logger from "@/lib/winston";
/**
 * Middleware
 */
/**
 * Node Modules
*/
import bcrypt from 'bcrypt'
/**
 * Repos
*/
import tokenRepository from "@/repository/tokenRepository/tokenRespository";
import { userRepository } from "@/repository/userRepository/userRepository";
/**
 * Types
*/
import { LoginCredentials, LoginResult, RefreshtokenInput, RefreshTokenResult, SafeUser, UserBase, UserCreateInput, UserDocument, UserRegister } from "@/models/user";
import { ensureDocument } from "@/utils/validation/ensureDocument";
import InvalidCrednetials from "@/errors/service/common/InvalidCredentials";
import sendEmail from "@/infra/mail/mailer.service";
import TokenError from "@/errors/service/common/TokenError";
import MailerError from "@/infra/mail/MailerError";
import { refreshToken } from "@/controllers/v1/auth/refresh-token";


const authService = {
    async login (credentials: LoginCredentials): Promise<LoginResult>{
        const { password, email } = credentials
        const user = await userRepository.findByEmailForLogin(email)

        ensureDocument(user, 'User')    

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch){
            throw new InvalidCrednetials()
        }
 
        const accessToken = generateAccessToken(user._id.toString())
        const refreshToken = generateRefreshToken(user._id.toString())

        logger.info('Refresh Token created for')

        await tokenRepository.create(refreshToken, user._id.toString())

        return {accessToken, refreshToken}
    },

    async refreshToken (refreshToken: string): Promise<RefreshTokenResult> {
        const tokenExists = await tokenRepository.findOneWithToken(refreshToken)
        ensureDocument(tokenExists, 'Token')

        if (!tokenExists) throw new TokenError('Invalid token', 'INVALID_TOKEN'); 
        if (tokenExists.revoked) throw new TokenError('Revoked Token', 'REVOKED_TOKEN');
        if (!tokenExists.expiresAt) throw new TokenError('Expired Token', 'EXPIRED_TOKEN');
        if (tokenExists.expiresAt < new Date()) throw new TokenError('Expired Token', 'EXPIRED_TOKEN');

        const jwtPayload = verifyRefreshToken(refreshToken) as { userId: string }
        const accessToken = generateAccessToken(jwtPayload.userId.toString())

        return {accessToken}
    },

    async register (credentials: UserRegister): Promise<{user: SafeUser; accessToken: string; refreshToken: string}> {
        const { email, password, role } = credentials;

        if(role === 'admin' /*&& !config.WHITELIST_ADMINS_EMAIL.includes(email)*/){
            logger.warn(`Registration as admin failed: ${email}`)
            throw new Error('Email not allowed for admin registration');
        }

        const userName = 'test'
        const userData = {userName, email, password, role} as UserBase
        const user = await userRepository.create(userData)
        const accessToken = generateAccessToken(user._id.toString())
        const refreshToken = generateRefreshToken(user._id.toString())

        await tokenRepository.create(refreshToken, user._id.toString())

        return {user, accessToken, refreshToken}
    },

    async logout (refreshToken: string, userId: string):Promise<void> {
        if (refreshToken){
            await tokenRepository.delete(refreshToken)
        }
        
        logger.info('User logged out', { userId })
    },

    async forgotpassword (credentials: Record<string, string>):Promise<void> {
        const { email, baseURL } = credentials     

        const user = await userRepository.findDocumentByEmail(email)
        ensureDocument(user, 'User')

        const resetToken = user.createResetPasswordToken()
        await userRepository.save(user)                             // ABSPEICHERN WICHTIG!!

        const resetUrl = `${baseURL}/${resetToken}`
        
        const message = `We have received a password reset request. Please use the link down below\n\n${resetUrl}\n\n This reset password link will be valid for 10 minutes.`
        
        try{
            await sendEmail ({
                email: user.email,
                subject: 'Password reset request',
                message
            })      
        } catch(err){
            user.passwordResetToken = ''
            user.passwordResetTokenExpires = null
            await userRepository.save(user)
    
            throw new MailerError()
        } 
    }
}

export default authService



