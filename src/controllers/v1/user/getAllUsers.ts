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
import User from "@/models/user";
import catchAsync from "@/utils/catchAsync";
/**
 * Middlewar
 */
/**
 * Types
 */
import { Request, Response } from "express";


const getAllUsers = catchAsync(async function (req: Request, res: Response): Promise<void> {
    const limit = Number(req.query.limit as string) ?? config.defaultResLimit       //query immer string ,  ?? weil nullish coalising, wenn query 0 is wäre es falsy  das heisst der nächste wert würde genommen
    const offset = Number(req.query.offset as string) ?? config.defaultOffset       // ?? weil nullish coalising, wenn query 0 is wäre es falsy  das heisst der nächste wert würde genommen 
    const total = await User.countDocuments()
    const users = await User.find()
    .select('-password -__v')                                        //IMMER Passwort nicht mitsenden
    .limit(limit)
    .skip(offset)
    .lean()
    .exec()


    if(!users || users.length === 0){
        logger.error('No Users found in the Database.')             //Nur logger kein Error. Leere DB ist kein Error
    }

    res.status(200).json({
        code: 'Success',
        message: 'Users retreived successfully',
        users,
        total,
        limit,
        offset,
    })
})

export default getAllUsers

