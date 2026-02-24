import { z } from 'zod'

const registerUserSchema = z.object({
    userName: z.string(),
    email: z.email('Must be valid format'),
    password: z.string().min(6, 'Password must have min 6 chars'),
    role: z.enum(['user', 'admin'])
})

export type RegisterUserDTO = z.infer<typeof registerUserSchema>