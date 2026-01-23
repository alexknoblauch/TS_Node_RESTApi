// repositories/userRepository.ts
import Blog, { BlogBasic, BlogLean, IBlog } from '@/models/blog';

/**
 * Types
 */

import { FilterQuery, Types, UpdateQuery } from 'mongoose';                     //excluded kritische values des schema

export const blogRepository = {
    findById: async(id: string):Promise<BlogLean | null> => {
        const blog = await Blog.findById(id).lean().exec()
        if(!blog) return null
        
        const leanBlog: BlogLean = {                   // mongoDB - TS problem TO STRING anpassen
                ...blog,
                _id: blog._id.toString(),
                author: blog.author.toString(),
            };

        return leanBlog
    },

    find: async(queryObj: FilterQuery<IBlog>, options: {populate?: string, sort?: string, skip?: number, limit?: number}):Promise<BlogLean[]> => {
        let query = Blog.find(queryObj)

        if(options.populate){query = query.populate(options.populate)}
        if(options.sort){ query = query.sort(options.sort)}
        if(options.skip){ query = query.skip(options.skip)}
        if(options.limit){ query = query.limit(options.limit)}

        const blog = await query.lean().exec()


        const leanBlog = blog.map(blog => {
            return {
                ...blog,
                _id: blog._id.toString(),
                author: blog.author.toString()
            }
        }) 

        return leanBlog
    },

    findBySlug: async(slug: string, populate?: string):Promise<BlogLean[] | null> => {
        let query = Blog.find({slug: slug})

        if(populate){
            query = query.populate(populate)
        }

        const blog = await query.lean().exec()

        const leanBlog = blog.map(blog => {
            return {
                ...blog,
                _id: blog._id.toString(),
                author: blog.author.toString()
            }
        })

        return leanBlog
    },
    
    create: async(data: Partial<IBlog>):Promise<IBlog> => {
        return Blog.create(data)
    },

    update: async(id:string, updatedData: UpdateQuery<IBlog>):Promise<IBlog | null> => {
        return await Blog.findByIdAndUpdate(id, updatedData, { new: true }).exec()
    },

    deleteById: async (id:string): Promise<boolean | null> => {
        const result = await Blog.deleteOne({_id: id})
        return result.deletedCount === 1
    }
}