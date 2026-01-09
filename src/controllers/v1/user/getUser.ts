/**
 * Node Modules
 */

/**
 * Custom Modules
 */
/**
 * Models
 */

import User from "@/models/user";
/**
 * Middleware
 */
import logger from "@/lib/winston";
import catchAsync from "@/utils/catchAsync";

/**
 * Types
 */
import type { Request, Response } from "express";
import type { AppError } from "@/middleware/errorHandler";
import getOrSetRedis from "@/utils/getOrSetRedis";

import { createUserRepository } from "@/Repositories/userRepository";

const userRepository = createUserRepository()


const getUser = (async function (userId: string) {
        const user = await userRepository.findById(userId)

        if(user == null){
            const error = new Error('User not found') as AppError;
            error.statusCode = 404;
            error.code = 'UserNotFound';
            throw error;
        }
        return user 
})

export default getUser