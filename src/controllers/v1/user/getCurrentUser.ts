/**
 * Custom Modules
 */

import logger from "@/lib/winston";

/**
 * Models
 */

import User from "@/models/user";
import catchAsync from "@/utils/catchAsync";

/**
 * Types
 */

import type {Request, Response} from 'express'

const getCurrentUser = (async (userId: string): Promise<void> =>{
    const user = await User.findById(userId)

}) 

export default getCurrentUser