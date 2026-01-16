/**
 * Node Modules
 */
import jwt from 'jsonwebtoken'
/**
 * Custom Modules
 */
import config from '@/config'
/**
 * Types 
 */
import { Types } from 'mongoose'


export const generateAccessToken = function(userId: string): string {
    if(!config.JWT_ACCESS_SECRET){
        throw new Error('JWT secret access token not found.')
    }
    return jwt.sign({userId}, config.JWT_ACCESS_SECRET, {
        expiresIn: config.ACCESS_TOKEN_EXPIRY,
        subject: 'accessApi'
    })
}


export const generateRefreshToken = function(userId: string): string {
    if(!config.JWT_REFRESH_SECRET){
        throw new Error('JWT secret refresh token not found.')
    }
    return jwt.sign({userId}, config.JWT_REFRESH_SECRET, {
        expiresIn: config.REFRESH_TOKEN_EXPIRY,
        subject: 'refreshToken'
    })
}


export const verifyAccessToken = (token: string) => {
    if(!config.JWT_ACCESS_SECRET){
        throw new Error('JWT secret refresh token not found.')
    }
    return jwt.verify(token, config.JWT_ACCESS_SECRET); 
};

export const verifyRefreshToken = (token: string) => {
        if(!config.JWT_REFRESH_SECRET){
        throw new Error('JWT secret refresh token not found.')
    }
    return jwt.verify(token, config.JWT_REFRESH_SECRET!); 
};