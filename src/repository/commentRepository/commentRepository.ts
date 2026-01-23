import Comment, { CommentCreateDTO, CommentLean, IComment } from "@/models/comment";

export const commentRepository = {
    create: async function(data: CommentCreateDTO):Promise<IComment> {
        return await Comment.create(data)
    },

    find: async function(filter: object, options?: {limit?: number; skip?: number; select?: string; sort?: any;}):Promise<CommentLean[]> {
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