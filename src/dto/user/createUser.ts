import { z } from 'zod'


export const createUserSchema = z.object({
    userName: z.string(),
    email: z.email('email wrong'),
    password: z.string().min(6, 'password at leat 6 chars'),
    role: z.enum(['user', 'admin'])
})

export type createUserDTO = z.infer<typeof createUserSchema>