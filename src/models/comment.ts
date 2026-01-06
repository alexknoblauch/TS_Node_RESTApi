/**
 * Node Modules
 */
import mongoose, { Schema, model, Types } from "mongoose"
import { z } from 'zod'


/**
 * Middleware
 */
/**
 * Types
 */
/**
 * Models
 */

const ICommentSchema = z.object({
    _id: z.instanceof(mongoose.Types.ObjectId).optional(),
    blogId: z.instanceof(mongoose.Types.ObjectId),
    userId: z.instanceof(mongoose.Types.ObjectId),
    comment: z.string()
        .min(1, "Kommentar darf nicht leer sein")
        .max(500, "Kommentar darf maximal 500 Zeichen lang sein")
});

export type IComment = z.infer<typeof ICommentSchema>;      //export type:  z.infer() macht type kein JS Value muss 

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