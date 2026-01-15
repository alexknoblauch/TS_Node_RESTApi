/**
 * Node Modules
 */
import { Schema, model, Types } from "mongoose"


/**
 * Middleware
 */
/**
 * Types
 */
/**
 * Models
 */

export interface IComment {
    _id: Types.ObjectId | string,  
    blogId: Types.ObjectId | string,
    userId: Types.ObjectId | string,
    comment: string,
}

export interface ICommentCreate {
    blogId: Types.ObjectId,
    userId: Types.ObjectId,
    comment: string,
}

export type CommentData = Pick <IComment, 'comment'>                   //PICK TYPE


const commentSchema = new Schema<IComment>({
    blogId: {
        type:  Schema.Types.ObjectId,
        required: [true, 'needs to have a value'],
        ref: "Blog"
    },
    userId: {
        type:  Schema.Types.ObjectId,
        required: [true, 'needs to have a value'],
        ref: "User"
    },
    comment: {
        type: String,
        required: [true, 'comment needs to have content'],
        maxLength: [1000, 'Content needs to be less then 1000 chars']
    }
}, {
    timestamps: true
})

export default model<IComment>('Comment', commentSchema)