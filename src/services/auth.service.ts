/**
 * Custom Modules
 */
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@/lib/jwt";
import logger from "@/lib/winston";
/**
 * Middleware
 */
import { AppError } from "@/middleware/errorHandler";
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
import { SafeUser } from "@/models/user";
import { genUsername } from "@/utils";
import createTokenError from "@/utils/tokenError";
import { ensureDocument } from "@/utils/ensureDocument";


interface LoginCredentials {
    email: string, 
    password: string
}

interface RegisterCredentials {
    email: string,
    password: string,
    role: 'admin' | 'user'
}


interface RegisterResult {
    user: SafeUser,
    accessToken: string,    
    refreshToken: string
}

interface LoginResult {
    accessToken: string
    refreshToken: string
}

interface RefreshTokenResult {
    accessToken: string
}


const authService = {
    async login (credentials: LoginCredentials): Promise<LoginResult>{
        const { password, email } = credentials
        const user = await userRepository.findByEmailForLogin(email)

        if(!user){
            const error = new Error('Invalid Login') as AppError;
            error.statusCode = 401;                 //LOGIN IMMER 401 kein ensureDocuments
            error.code = 'Invalid Login';
            throw error;
        }       

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch){
            const error = new Error('Invalid Login') as AppError;
            error.statusCode = 401;                 //LOGIN IMMER 401 kein ensureDocuments
            error.code = 'Invalid Login';
            throw error;
        }

        const accessToken = generateAccessToken(user._id.toString())
        const refreshToken = generateRefreshToken(user._id.toString())

        logger.info('Refresh Token created for')

        await tokenRepository.create(refreshToken, user._id.toString())

        return {accessToken, refreshToken}
    },


    async refreshToken (refreshToken: string): Promise<RefreshTokenResult> {
        const tokenExists = await tokenRepository.findOneWithToken(refreshToken)

        if (!tokenExists) throw createTokenError('TokenNotFound', 401); 
        if (tokenExists.revoked) throw createTokenError('TokenRevoked');
        if (!tokenExists.expiresAt) throw createTokenError('TokenInvalid');
        if (tokenExists.expiresAt < new Date()) throw createTokenError('TokenExpired');

        const jwtPayload = verifyRefreshToken(refreshToken) as { userId: string }
        const accessToken = generateAccessToken(jwtPayload.userId.toString())

        return {accessToken}
    },

    async register (credentials: RegisterCredentials): Promise<RegisterResult> {
        const { email, password, role } = credentials;

        if(role === 'admin' /*&& !config.WHITELIST_ADMINS_EMAIL.includes(email)*/){
            logger.warn(`Registration as admin failed: ${email}`)
            throw new Error('Email not allowed for admin registration');
        }

        const userName = genUsername()
        const user = await userRepository.create({userName, email, password, role})
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
    }
}

export default authService