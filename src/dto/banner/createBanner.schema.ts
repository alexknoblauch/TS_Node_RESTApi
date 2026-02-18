import { z } from 'zod'

export const creareBannerSchema = z.object({
  publicId: z.string().min(1, "Banner ID is required"),
  url: z.string().url("Banner URL must be valid"),
  width: z.number().positive("Banner width must be positive"),
  height: z.number().positive("Banner height must be positive"),
});

export type createBannerDTO = z.infer<typeof creareBannerSchema>