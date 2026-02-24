import { z } from 'zod'

export const updateCommentSchema = z.object({
    comment: z.string()
})

export type CommentUpdateDTO = z.infer<typeof updateCommentSchema>

