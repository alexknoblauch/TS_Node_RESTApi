// repositories/userRepository.ts
import User, { IUser } from '@/models/user';

export const userRepository = {

    findByEmail: async (email: string): Promise<IUser | null> => {
        return await User.findOne({ email }).lean().exec();
    },

    findByEmailForLogin: async (email: string): Promise<IUser | null> => {
        return await User.findOne({ email }).select('+password').lean().exec();        // Alle Felder + email
    },

    find: async (filter: any, options?: {
            limit?: number;
            skip?: number;
            select?: string;
            sort?: any;
        }
        ): Promise<IUser[]> => {

            let query = User.find(filter);

            if (options?.select) query = query.select(options.select);
            if (options?.sort) query = query.sort(options.sort);
            if (options?.skip !== undefined) query = query.skip(options.skip);
            if (options?.limit !== undefined) query = query.limit(options.limit);

            return query.lean().exec();
        },

    findById: async(id: string):Promise<IUser | null> => {
        return await User.findById(id)
    },

    create: async (userData: Partial<IUser>): Promise<IUser> => {
        const user = await User.create(userData);
        return user.toObject();
    },

    updateById: async (id: string, updateData: Partial<IUser>): Promise<IUser | null> => {
        return User.findByIdAndUpdate(id, updateData, { new: true, lean: true }).exec();
    },

    deleteById: async (id: string): Promise<boolean> => {
        const result = await User.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0;
    },
};