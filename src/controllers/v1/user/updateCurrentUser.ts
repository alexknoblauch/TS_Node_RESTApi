/**
 * Custom Modules
 */

import logger from "@/lib/winston";
import bcrypt from 'bcrypt'

/**
 * Models
 */

import User from "@/models/user";
import catchAsync from "@/utils/catchAsync";

/**
 * Types
 */

import type { Request, Response } from 'express'
import type { AppError } from '@/middleware/errorHandler'

const updateCurrentUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId

    const {
        username,
        password,
        email,
        firstName,
        lastName,
        website,
        youtube,
        facebook,
        instagram,
        linkedin,
        x
    } = req.body
    const user = await User.findById(userId).select('-__v')

    if(!user){
        const error = new Error('User not found') as AppError;
        error.statusCode = 404;
        error.code = 'UserNotFound';
        throw error;
    }

    if (username) {user.userName = username}
    if (email) {user.email = email;}
    if (password) {
        user.password = await bcrypt.hash(password, 12);
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

    await user.save()
    logger.info('User successfully updated')

    res.status(200).json({
        user
    })

})

export default updateCurrentUser