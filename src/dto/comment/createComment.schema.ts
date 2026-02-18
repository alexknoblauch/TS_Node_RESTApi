import { z } from 'zod'

export const createCommentSchema = z.object({
    blogId: z.string(),
    userId: z.string(),
    comment: z.string()
})

export type CommentCreateDTO = z.infer<typeof createCommentSchema>