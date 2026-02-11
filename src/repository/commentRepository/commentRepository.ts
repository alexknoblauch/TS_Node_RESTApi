import Comment, { CommentBase, CommentCreateDTO, CommentLean, IComment } from "@/models/comment";
import { FilterQuery } from "mongoose";

export const commentRepository = {
    create: async function(data: CommentCreateDTO): Promise<CommentLean> {
        const comment =  await Comment.create(data)

        const commentObj = comment.toObject()

        const leanComment = {
            ... commentObj,
            _id: commentObj._id.toString(),
            blogId: commentObj.blogId.toString(),
            userId: commentObj.userId.toString()
        }

        return leanComment
    },

    findById: async function(commentId: string): Promise<CommentLean | null> {
        const comment = await Comment.findById(commentId)
        if(!comment) return null
        const commentObj = comment.toObject()

        const leanComment = {
            ... commentObj,
            _id: commentObj._id.toString(),       
            blogId: commentObj.blogId.toString(),
            userId: commentObj.userId.toString()
        }

        return leanComment
    },

    find: async function(filter: FilterQuery<CommentBase>, options?: {limit?: number; skip?: number; select?: string; sort?: any;}):Promise<CommentLean[]> {
        const query = Comment.find(filter).lean();

        if(options?.limit) query.limit(options.limit);
        if(options?.skip) query.skip(options.skip);
        if(options?.select) query.select(options.select);
        if(options?.sort) query.sort(options.sort);

        const comment = await query

        const leanComment = comment.map(comment => { 
                return {
                    ...comment,
                    _id: comment._id.toString(),
                    blogId: comment.blogId.toString(),
                    userId: comment.userId.toString(),
                }
            });
        
        return leanComment;
    },

    deleteById: async function(id: string):Promise<boolean> {
        const result = await Comment.deleteOne({ _id: id });
        return result.deletedCount > 0;
    }
}