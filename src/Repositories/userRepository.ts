/**
 * Custom Modules
 */
import User from '@/models/user'

/**
 * Types
 */
import { IUser } from '@/models/user'
import getOrSetRedis from '@/utils/getOrSetRedis'


export type CreateUserInput = Pick<IUser,                       // Create immer Pick
  'userName' | 'email' | 'role' | 'firstName' | 'lastName' | 'socialLinks'
>
export type UserResponse = {
    id: string,
    userName: string,
    email: string,
    role: string,
    firstName?: string,
    lastName?: string,
    socialLinks?: IUser['socialLinks'] 
}


export type UpdateUserInput = Partial<Omit<IUser,               //Update immer PARTIAL
  'twoFactorSecret' | 'twoFactorEnabled' | 'refreshToken'
>>




export const createUserRepository = () => {             //leer lassen für DB (Hihger Order fn)
  return {
    create: async (userData: CreateUserInput): Promise<UserResponse | null> => {          // mongoose method git Promise<.....> zurück
        const doc = await User.create(userData)

        if(!doc) return null                            // return null wegen oben UserResponse | null

        return {
          id: doc._id.toString(),
          userName: doc.userName,
          email: doc.email,
          role: doc.role,
          firstName: doc.firstName,
          lastName: doc.lastName,
          socialLinks: doc.socialLinks
        }
    },

    
    // READ
    find: async (): Promise<UserResponse[] | null> => {           // mongoose method git Promise<.....> zurück
        const doc = await User.find().select('-__v -password -refreshToken').lean().exec()

        if(!doc) return null                        

        return doc.map((doc): UserResponse  => ({
            id: doc._id.toString(),
            userName: doc.userName,
            email: doc.email,
            role: doc.role,
            firstName: doc.firstName,
            lastName: doc.lastName,
            socialLinks: doc.socialLinks
        }))
    },

    
    findById: async (id: string): Promise<UserResponse | null> => {
      const cacheKey = `User:${id}`

      return await getOrSetRedis<UserResponse | null>(cacheKey, async () => {
           const doc = await User.findById(id).select('-__v -password -refreshToken').lean().exec()
            if(!doc) return null

            return {
                id: doc._id.toString(),
                userName: doc.userName,
                email: doc.email,
                role: doc.role,
                firstName: doc.firstName,
                lastName: doc.lastName,
                socialLinks: doc.socialLinks
            }
    })
    },

    
    findByEmail: async (email: string): Promise<UserResponse | null> => {
        const cacheKey = `User:${email.toLowerCase().trim()}`                   //Email normalieisren !!

       return await getOrSetRedis<UserResponse | null>(cacheKey, async () => {
            const doc = await User.findOne({ email })

            if(!doc) return null

            return {
                id: doc._id.toString(),
                userName: doc.userName,
                email: doc.email,
                role: doc.role,
                firstName: doc.firstName,
                lastName: doc.lastName,
                socialLinks: doc.socialLinks
            }
       })
    },

    
    findByUsername: async (userName: string): Promise<UserResponse | null> => {
        const cacheKey = `User:${userName}`                   //Email normalieisren !!

        return await getOrSetRedis<UserResponse | null>(cacheKey, async () => {

        const doc = await User.findOne({ userName })

        if(!doc) return null

        return {
            id: doc._id.toString(),
            userName: doc.userName,
            email: doc.email,
            role: doc.role,
            firstName: doc.firstName,
            lastName: doc.lastName,
            socialLinks: doc.socialLinks
        } 
    })
    },

    
    updateOne: async (id: string, updateData: UpdateUserInput): Promise<UserResponse | null> => {
        const doc = await User.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true } 
        )

        if(!doc) return null

        return {
          id: doc._id.toString(),
          userName: doc.userName,
          email: doc.email,
          role: doc.role,
          firstName: doc.firstName,
          lastName: doc.lastName,
          socialLinks: doc.socialLinks
        }
    },


    deleteOne: async (id: string): Promise<boolean> => {
        const doc = await User.findByIdAndDelete(id)

        return doc !== null                             // true wenn gelöscht, false wenn nicht existiert
    },
    
  }
}

// Type für TypeScript (optional)
export type UserRepository = ReturnType<typeof createUserRepository>