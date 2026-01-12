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
import { userRepository } from "@/repository/userRepository";
/**
 * Types
 */
import { Request, Response } from "express";


const getAllUsers = (async function (limit: number, skip: number): Promise<IUser[]> {
    
    const users = await userRepository.find( {} , {limit, skip})

    if(!users || users.length === 0){
        logger.error('No Users found in the Database.')             //Nur logger kein Error. Leere DB ist kein Error
    }

    return users
})

export default getAllUsers

