/**
 * Node Modules
 */
import {Schema, model} from 'mongoose'

/**
 * Custom Modules
 */
/**
 * Types
 */
import type { Types } from 'mongoose'

/**
 * Middleware
 */


interface IToken {
    token: string,
    userId: Types.ObjectId
}


const tokenSchema = new Schema<IToken> ({
    token: {
        type: String,
        required: [true, 'token is required']
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'userId is required']

    }
})

export const Token = model<IToken>('Token', tokenSchema)