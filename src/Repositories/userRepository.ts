/**
 * Custom Modules
 */
import { redisClient } from '@/lib/redis'
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
            const cacheKey = `User:${doc._id.toString()}`;

            if(!doc) return null                            // return null wegen oben UserResponse | null

            const userResponse = {
                id: doc._id.toString(),
                userName: doc.userName,
                email: doc.email,
                role: doc.role,
                firstName: doc.firstName,
                lastName: doc.lastName,
                socialLinks: doc.socialLinks
            }
            
            await redisClient.set(cacheKey, JSON.stringify(userResponse), { EX: 3600 });

            return userResponse
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

      return await getOrSetRedis<UserResponse | null>(cacheKey, async () => {           //Generic auch hier! kei Promise<> weil getorsetredis die promise schon auflöst
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

    save: async <T>(userData: any) => {                 //generic für type definition in code
        const user = new User(userData);
        return await user.save() as T
    },

    
    updateOne: async (id: string, updateData: UpdateUserInput): Promise<UserResponse | null> => {
        const cacheKey = `User:${id}`
        const doc = await User.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true } 
        )

        if(!doc) return null

        const updatedUser =  {
          id: doc._id.toString(),
          userName: doc.userName,
          email: doc.email,
          role: doc.role,
          firstName: doc.firstName,
          lastName: doc.lastName,
          socialLinks: doc.socialLinks
        }

        redisClient.set(cacheKey, JSON.stringify(updatedUser), { EX: 3600 })

        return updatedUser
    },


    deleteOne: async (id: string): Promise<{deletedCount: number}> => {         // SPEZEIALTYP für spezeille fälle
        const doc = await User.findByIdAndDelete(id)

        if(!doc) throw new Error('no User found')

        //REDIS
        let keysToDelete = []

        if(doc.email){
            keysToDelete.push(`User:${doc.email.toLowerCase().trim()}`)      
        }
        if(doc.userName){
            keysToDelete.push(`User:${doc.userName.toLowerCase().trim()}`)
        }
        if(doc._id){
            keysToDelete.push(`User:${doc._id.toString()}`)       // immer zu string wen JS !!
        }

        return { deletedCount: 1 };
    },
    
    existsByEmail: async(email: string):Promise<boolean> => {
            const doc = await User.exists({ email: email })
            return doc !== null;
    },

    existUsername: async(username: string): Promise<boolean> => {
        const doc = await User.exists({ username: username})
        return doc !== null
    }
    
  }
}

// Type für TypeScript (optional)
export type UserRepository = ReturnType<typeof createUserRepository>