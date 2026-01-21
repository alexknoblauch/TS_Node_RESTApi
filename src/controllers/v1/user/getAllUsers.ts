/**
 * Node Modules
 */
/**
 * Custom Modules
 */

import logger from "@/lib/winston";
import config from "@/config";
/**
 * Models
 */
import User, { IUser } from "@/models/user";
import catchAsync from "@/utils/catchAsync";
/**
 * Repos
 */
import { userRepository } from "@/repository/userRepository/userRepository";
/**
 * Types
 */
import { Request, Response } from "express";
import getOrSetRedis from "@/utils/getOrSetRedis";


const getAllUsers = (async function (limit: number, skip: number): Promise<IUser[]> {
    
    const users = await userRepository.find( {} , {limit, skip})


    const cacheKey = `Users:${limit}:${skip}`

    await getOrSetRedis(cacheKey, async () => {
        const users = await User.find()
            .select('-password -__v')                                        //IMMER Passwort nicht mitsenden
            .limit(limit)
            .skip(offset)
            .lean()
            .exec()

            if(!users || users.length === 0){
                logger.error('No Users found in the Database.')             //Nur logger kein Error. Leere DB ist kein Error
            }
            return users
    })
  

    return users
})

export default getAllUsers

