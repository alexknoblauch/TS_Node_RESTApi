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


export const generateAccessToken = function(userId: Types.ObjectId): string {
    if(!config.JWT_ACCESS_SECRET){
        throw new Error('JWT secret access token not found.')
    }
    return jwt.sign({userId}, config.JWT_ACCESS_SECRET, {
        expiresIn: config.ACCESS_TOKEN_EXPIRY,
        subject: 'accessApi', 
        algorithm: 'HS256'
    })
}


export const generateRefreshToken = function(userId: Types.ObjectId): string {
    if(!config.JWT_REFRESH_SECRET){
        throw new Error('JWT secret refresh token not found.')
    }
    return jwt.sign({userId}, config.JWT_REFRESH_SECRET, {
        expiresIn: config.REFRESH_TOKEN_EXPIRY,
        subject: 'refreshToken',
        algorithm: 'HS256'
    })
}


export const verifyAccessToken = (token: string) => {
    if(!config.JWT_ACCESS_SECRET){
        throw new Error('JWT secret refresh token not found.')
    }
    return jwt.verify(token, config.JWT_ACCESS_SECRET, {
        algorithms: ['HS256'] 
    }); 
};

export const verifyRefreshToken = (token: string) => {
        if(!config.JWT_REFRESH_SECRET){
        throw new Error('JWT secret refresh token not found.')
    }
    return jwt.verify(token, config.JWT_REFRESH_SECRET!, {
        algorithms: ['HS256'] 
    }); 
};