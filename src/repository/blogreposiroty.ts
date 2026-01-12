// repositories/userRepository.ts
import Blog, { IBlog } from '@/models/blog';

/**
 * Types
 */

import { FilterQuery } from 'mongoose';                     //excluded kritische values des schema

export const blogRepository = {
    findById: async(id: string):Promise<IBlog | null> => {
        return await Blog.findById(id).lean().exec()
    },

    findBySlug: async(slug: string, populate?: string):Promise<IBlog[] | null> => {
        let query = Blog.find({slug: slug})

        if(populate){
            query = query.populate(populate)
        }

        return query.lean().exec()
    },

    find: async (filter: FilterQuery<IBlog>, options?: {limit?: number; skip?: number; select?: string; sort?: any;}): 
        Promise<IBlog[]> => {
            let query = Blog.find(filter)

            if(options?.limit) query = query.limit(options.limit)
            if(options?.skip) query = query.skip(options.skip)
            if(options?.select) query = query.select(options.select)
            if(options?.sort) query = query.sort(options.sort)

            return query.lean().exec()
        },
    
    create: async(data: Partial<IBlog>):Promise<IBlog> => {
        return Blog.create(data)
    },

    update: async(id:string, updatedData:any):Promise<IBlog | null> => {
        return await Blog.findByIdAndUpdate(id, updatedData, { new: true, lean: true }).exec()
    },

    delete: async(id:string): Promise<boolean | null> => {
        const result = await Blog.deleteOne({_id: id})
        return result.deletedCount === 1
    }
}