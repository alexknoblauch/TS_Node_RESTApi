/**
 * Node Modules
 */
import logger from "@/lib/winston";
/**
 * Custom Modules
 */

import config from "@/config";
/**
 * Models
 */
import User, { IUser } from "@/models/user";
import catchAsync from "@/utils/async/catchAsync";

/**
 * Types
 */
import { Request, Response } from "express";
import getOrSetRedis from "@/infra/cache/getOrSetRedis";


const getAllUsers = catchAsync(async function (req: Request, res: Response): Promise<IUser[]> {
    const limit = Number(req.query.limit as string) ?? config.defaultResLimit       //query immer string ,  ?? weil nullish coalising, wenn query 0 is wäre es falsy  das heisst der nächste wert würde genommen
    const offset = Number(req.query.offset as string) ?? config.defaultOffset       // ?? weil nullish coalising, wenn query 0 is wäre es falsy  das heisst der nächste wert würde genommen 
    const total = await User.countDocuments()
    const user = await User.findById(req.userId).select('role').lean().exec();



    const cacheKey = `Users:${limit}:${offset}:${user?.role}`

    const users = await getOrSetRedis(cacheKey, async () => {
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

