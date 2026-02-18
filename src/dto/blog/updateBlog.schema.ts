import { z } from 'zod'
import { creareBannerSchema } from '../banner/createBanner'

export const updateBlogSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").max(180, "Title too long").optional(),
  content: z.string().min(1, "Content cannot be empty").optional(),
  banner: creareBannerSchema.optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export type updateBlogDTO = z.infer<typeof updateBlogSchema>
