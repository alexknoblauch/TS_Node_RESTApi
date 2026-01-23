/**
 * Node Modules
 */
import mongoose, { Schema, model, Types } from "mongoose"


/**
 * Models
 */

export interface IComment {
    _id: Types.ObjectId,  
    blogId: Types.ObjectId,
    userId: Types.ObjectId,
    comment: string,
}

export interface CommentLean {
    _id: string,  
    blogId: string,
    userId: string,
    comment: string,
}

export interface CommentCreateDTO {
    blogId: string,
    userId: string,
    comment: string,
}

export interface CommentUpdateDTO {
    comment?: string,
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