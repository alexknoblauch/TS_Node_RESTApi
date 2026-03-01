// repositories/userRepository.ts
import { createUserDTO } from '@/dto/user/createUser';
import User, { IUser, UserBase, UserDocument, UserLean } from '@/models/user';
import { Query, UpdateQuery } from 'mongoose'

export const userRepository = {

    findByEmail: async (email: string): Promise<UserLean | null> => {
        const user = await User.findOne({ email }).lean().exec();

        if(!user) return null

        const leanUser = {
            ...user,
            _id: user._id.toString()
        }

        return leanUser
    },

    findDocumentById: async (userId: string): Promise<UserDocument | null> => {
        const user = await User.findById(userId).exec()
        return user as UserDocument | null
    },

    findDocumentByEmail: async (email: string): Promise<UserDocument | null> => {     // Instanz Ebene speziell
        const user =  await User.findOne({ email }).exec();
        return user as UserDocument | null
    },

    findDocumentByToken: async(token: string): Promise<UserDocument | null> => {
        const user = await User.findOne({ passwordResetToken: token, passwordResetTokenExpires: { $gt: new Date() } })
        //passwordResetTokenExpires  EXTEM WICHTIG sonst können alte token verwendet werden
        return user as UserDocument | null
    },

    save: async (user: UserDocument):Promise<UserDocument> => {         // INSTANAZ METHODE
        return await user.save()
    },

    findByEmailForLogin: async (email: string): Promise<UserLean | null> => {
        const user = await User.findOne({ email }).select('+password').lean().exec();        // Alle Felder + email
        
        if(!user) return null

        const leanUser = {
            ...user,
            _id: user._id.toString()
        }

        return leanUser
    },

    find: async (filter: any, options?: {limit?: number, skip?: number, select?: string, sort?: any}): Promise<UserLean[]> => {
            let query: Query<UserDocument[], UserDocument> = User.find(filter);  // query.select könnte types verändern. Query<> garantiert types und löst das problem

            if (options?.select) query = query.select(options.select);
            if (options?.sort) query = query.sort(options.sort);
            if (options?.skip !== undefined) query = query.skip(options.skip);
            if (options?.limit !== undefined) query = query.limit(options.limit);

            const user = await query.lean<UserLean[]>().exec();

            const leanUser = user.map(user => {
                return {
                        ...user,
                        _id: user._id.toString()
                    }
            })
 
            return leanUser
        },

    findById: async(id: string):Promise<UserLean | null> => {
        const user = await User.findById(id).lean().exec()

        if(!user) return null

        const leanUser = {
            ...user,
            _id: user._id.toString()
        }
        
        return leanUser
    },

    create: async (userData: createUserDTO): Promise<UserDocument> => {
        const user = await User.create(userData);
        return user as UserDocument
    },

    updateById: async (id: string, updateData: UpdateQuery<UserBase>): Promise<UserLean | null> => {
        const user = await User.findByIdAndUpdate(id, updateData, { new: true, lean: true }).exec();
        if(!user) return null

        const leanUser = {
            ... user,
            _id: user._id.toString()
        }

        return leanUser
    },
    
    deleteById: async (id: string): Promise<boolean> => {
        const result = await User.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0;
    }
};