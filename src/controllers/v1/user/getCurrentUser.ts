/**
 * Custom Modules
 */


/**
 * Models
 */

import { createUserRepository, UserResponse } from "@/Repositories/userRepository";
import getOrSetRedis from "@/utils/getOrSetRedis";

/**
 * Types
 */

const userRepository = createUserRepository()


const getCurrentUser = (async (userId: string): Promise<UserResponse | null> =>{
    const user = await userRepository.findById(userId)

    if (!user) {
        throw new Error(`User not found ${userId}`);
    }

    return user;
}) 

export default getCurrentUser