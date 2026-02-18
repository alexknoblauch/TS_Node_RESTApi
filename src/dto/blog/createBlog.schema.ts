import { z } from 'zod'

export const createBlogSchema = z.object({
   title: z
    .string()
    .min(1, "Title is required")
    .max(180, "Title must be less than 180 chars"), 

  content: z
    .string()
    .min(1, "Content is required"),

  banner: z.object({
    publicId: z.string().min(1, "Banner ID is required"),
    url: z.string().url("Banner URL must be valid"),
    width: z.number().positive("Banner width must be positive"),
    height: z.number().positive("Banner height must be positive")
  }).optional(), 

  author: z.string().min(1, "Author required"),

  status: z.string().optional()
})

export type CreateBlogDTO = z.infer<typeof createBlogSchema>

