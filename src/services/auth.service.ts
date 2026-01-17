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
import { LoginResult } from "@/types/auth";
import { refreshToken } from "@/controllers/v1/auth/refresh-token";
import { Types } from "mongoose";
import { IUser, SafeUser } from "@/models/user";
import { config } from "dotenv";
import { genUsername } from "@/utils";


interface LoginCredentials {
    email: string, 
    password: string
}

interface RefreshTokenResult {
    accessToken: string
}

interface RegisterResult {
    user: SafeUser,
    accessToken: string,    
    refreshToken: string
}

interface RegisterCredentials {
    email: string,
    password: string,
    role: 'admin' | 'user'

}




const authService = {
    async login (credentials: LoginCredentials): Promise<LoginResult>{
        const { password, email } = credentials
        const user = await userRepository.findByEmailForLogin(email)

        if(!user){
            const error = new Error(`No User found with email ${email}`) as AppError;
            error.statusCode = 400;
            error.code = 'UserNotFound';
            throw error;
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch){
            const error = new Error('Invalid password') as AppError;
            error.statusCode = 401; 
            error.code = 'InvalidPassword';
            throw error;
        }

        const accessToken = generateAccessToken(user._id.toString())
        const refreshToken = generateRefreshToken(user._id.toString())

        logger.info('Refresh Token created for', {
            user: user,
            token: refreshToken
        })

        await tokenRepository.create(refreshToken, user._id.toString())

        return {accessToken, refreshToken}
    },


    async refreshToken (refreshToken: string): Promise<RefreshTokenResult> {
        const tokenExists = await tokenRepository.findOneWithToken(refreshToken)

        if(!tokenExists){
            const error = new Error(`'Invalid or expired authentication token`) as AppError;
            error.statusCode = 404;
            error.code = 'TokenNotFound';
            throw error;
        }

        if (tokenExists.revoked) {
            const error = new Error('Invalid or expired authentication token') as AppError;
            error.statusCode = 401;
            error.code = 'TokenRevoked';
            throw error;
        }

        if(!tokenExists.expiresAt){
            const error = new Error('Invalid or expired authentication token') as AppError;
            error.statusCode = 404;
            error.code = 'TokenNotFound';
            throw error;
        }
        
        if (tokenExists.expiresAt < new Date()) {
            const error = new Error('Invalid or expired authentication token') as AppError;
            error.statusCode = 401;
            error.code = 'TokenExpired';
            throw error;
        }

        const jwtPayload = verifyRefreshToken(refreshToken) as { userId: Types.ObjectId }
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
            tokenRepository.delete(refreshToken)
        }
        
        logger.info('User refresh Token deleted successfully', {
            token: refreshToken,
            userId

        })

        logger.info('User logged out successfully', {
            userId        
        })
    }
}

export default authService