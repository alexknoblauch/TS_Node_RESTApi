/**
 * Custom Modules
 */

import {Types, Schema, model} from 'mongoose'

export interface IToken {
    token: string
    userId: Types.ObjectId 
    createdAt: Date;
    expiresAt: Date;
    revoked?: boolean; 
    revokedAt?: Date; 
}

export interface ITokenPersistence {
  token: string;
  userId: string;           // Im Domain immer string!
  createdAt: Date;
  expiresAt: Date;
  revoked?: boolean;
  revokedAt?: Date | null;
}

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        select: false
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User', 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now, 
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } 
    },
    revoked: {
        type: Boolean,
        default: false 
    },
    revokedAt: {
        type: Date,
         default: null
    }
})



export default model<IToken>('Token', tokenSchema)