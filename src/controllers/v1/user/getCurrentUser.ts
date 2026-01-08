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
    const cacheKey = `User:${userId}`

        const user = await getOrSetRedis<UserResponse | null> (cacheKey, async () => {      //Generic auch hier! kei Promise<> weil getorsetredis die promise schon auflöst
            const user = await userRepository.findById(userId)

            if(!user) throw new Error(`User nor found, ${userId}`)
            return user
        })
        if (!user) {
            throw new Error(`Cache returned null for user: ${userId}`);
        }
    
        return user;
}) 

export default getCurrentUser