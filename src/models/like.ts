/**
 * Node Modules
 */

import {Schema, model, Types} from 'mongoose'


interface ILike {
    blogId?: Types.ObjectId,
    userId: Types.ObjectId,
    commentId?: Types.ObjectId
}


const likeSchema = new Schema<ILike>({
    blogId: {
        type: Schema.Types.ObjectId
    },
    userId: {
        type: Schema.Types.ObjectId,
        requierd: [true, 'userId must be set for like']
    },
    commentId: {
        type: Schema.Types.ObjectId
    }
})

export default model<ILike>('Like', likeSchema)