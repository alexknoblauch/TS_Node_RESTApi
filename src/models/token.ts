/**
 * Custom Modules
 */

import {Types, Schema, model} from 'mongoose'

interface IToken {
    token: string
    userId: Types.ObjectId
}

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User', 
        required: true
    }
})

export default model<IToken>('Token', tokenSchema)