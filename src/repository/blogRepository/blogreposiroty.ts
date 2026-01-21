// repositories/userRepository.ts
import Blog, { BlogBasic, BlogLean, IBlog } from '@/models/blog';

/**
 * Types
 */

import { FilterQuery } from 'mongoose';                     //excluded kritische values des schema

export const blogRepository = {
    findById: async(id: string):Promise<IBlog | null> => {
        return await Blog.findById(id).lean().exec()
    },

    find: async(queryObj: FilterQuery<BlogLean>, options: {populate?: string, sort?: string, skip?: number, limit?: number}):Promise<IBlog[]> => {
        let query = Blog.find({_id: queryObj.id})

        if(options.populate){query = query.populate(options.populate)}
        if(options.sort){ query = query.sort(options.sort)}
        if(options.skip){ query = query.skip(options.skip)}
        if(options.limit){ query = query.limit(options.limit)}

        return query.lean().exec()
    },

    findBySlug: async(slug: string, populate?: string):Promise<BlogBasic[] | null> => {
        let query = Blog.find({slug: slug})

        if(populate){
            query = query.populate(populate)
        }

        return query.lean().exec()
    },
    
    create: async(data: Partial<IBlog>):Promise<IBlog> => {
        return Blog.create(data)
    },

    update: async(id:string, updatedData:any):Promise<IBlog | null> => {
        return await Blog.findByIdAndUpdate(id, updatedData, { new: true, lean: true }).exec()
    },

    deleteById: async (id:string): Promise<boolean | null> => {
        const result = await Blog.deleteOne({_id: id})
        return result.deletedCount === 1
    }
}