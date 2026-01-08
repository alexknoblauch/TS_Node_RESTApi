/**
 * Custom Modules
 */

import logger from "@/lib/winston";
import bcrypt from 'bcrypt'

/**
 * Types
 */

import type { AppError } from '@/middleware/errorHandler'

/**
 * REpos
 */

import { createUserRepository, UserResponse } from "@/Repositories/userRepository";

const userRepository = createUserRepository()

const updateCurrentUser = (async (
    userId: string,
    username?: string,
    password?: string,
    email?: string,
    firstName?: string,
    lastName?: string,
    website?: string,
    youtube?: string,
    facebook?: string,
    instagram?: string,
    linkedin?: string,
    x?: string): Promise<UserResponse | null> => {

    const user = await userRepository.findById(userId)

    if(!user){
        const error = new Error('User not found') as AppError;
        error.statusCode = 404;
        error.code = 'UserNotFound';
        throw error;
    }

    if (username) {user.userName = username}
    if (email) {user.email = email;}
    if (password) {
        (user as any).password = await bcrypt.hash(password, 12);
    }
    if (firstName) {user.firstName = firstName;}
    if (lastName) {user.lastName = lastName;}
    if (!user.socialLinks) {user.socialLinks = {};}
    if (website) {user.socialLinks.website = website;}
    if (facebook) {user.socialLinks.facebook = facebook;}
    if (instagram) {user.socialLinks.instagram = instagram;}
    if (linkedin) {user.socialLinks.linkedin = linkedin;}
    if (x) {user.socialLinks.x = x;}
    if (youtube) {user.socialLinks.youtube = youtube;}

    const savedUser = await userRepository.save<UserResponse>(user)         //save<TYPE> nicht vergessen!
    if(!savedUser) throw Error(`saving user went wrong)`)
    logger.info('User successfully updated')

    return savedUser
})

export default updateCurrentUser