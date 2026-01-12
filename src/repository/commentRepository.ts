import Comment, { IComment, ICommentCreate } from "@/models/comment";

export const commentRepository = {
    create: async function(data: ICommentCreate):Promise<IComment> {
        return await Comment.create(data)
    },

    find: async function(filter: object, options?: {limit?: number; skip?: number; select?: string; sort?: any;}):Promise<IComment[]> {
        const query = Comment.find(filter)

        if(options?.limit) query.limit(options.limit)
        if(options?.skip) query.skip(options.skip)
        if(options?.select) query.select(options.select)
        if(options?.sort) query.sort(options.sort)

        return await query
    },

    delete: async function(id: string):Promise<boolean> {
        return await Comment.deleteOne({_id: id})
    }
}