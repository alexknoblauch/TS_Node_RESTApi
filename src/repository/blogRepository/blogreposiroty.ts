/**
 * Models
 */
import Blog, { BlogBase,  BlogDocument, BlogLean, CreateBlogDTO, IBlog } from '@/models/blog';

/**
 * Types
 */

import {UpdateQuery } from 'mongoose';       // excludes kritische values des schema
import { FilterQuery } from 'mongoose';


export const blogRepository = {
    findById: async(id: string): Promise<BlogLean | null> => {
        const blog = await Blog.findById(id).lean().exec()
        if(!blog) return null
        
        const leanBlog: BlogLean = {                   // mongoDB - TS problem TO STRING anpassen
                ...blog,
                _id: blog._id.toString(),
                author: blog.author.toString(),
            };

        return leanBlog
    },

    findDocumentById: async(userId: string): Promise<BlogDocument | null> => {
        const user = await Blog.findById(userId).exec()
        return user as BlogDocument | null
    },

    find: async(queryObj: FilterQuery<BlogBase>, options: {populate?: string, sort?: string, skip?: number, limit?: number}):Promise<BlogLean[] | NonNullable> => {
        let query = Blog.find(queryObj)

        if(options.populate){query = query.populate(options.populate)}
        if(options.sort){ query = query.sort(options.sort)}
        if(options.skip !== undefined){ query = query.skip(options.skip)}        //skip limit auf undefined cehcken
        if(options.limit !== undefined){ query = query.limit(options.limit)}     //skip limit auf undefined cehcken

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

    findBySlug: async(slug: string, populate?: string):Promise<BlogLean | null> => {
        let query = Blog.findOne({slug: slug})

        if(populate){
            query = query.populate(populate)
        }

        const blog = await query.lean().exec()
        if(!blog) return null                       //nicht ensure Document

        const leanBlog = {
                ...blog,
                _id: blog._id.toString(),
                author: blog.author.toString()
        }

        return leanBlog
    },
    
    create: async(data: CreateBlogDTO): Promise<BlogLean> => {
        const newBlog = await  Blog.create(data)

        const blogObj = newBlog.toObject()

        const blog = {
            ... blogObj,
            _id:  blogObj._id.toString(),
            author: blogObj.author.toString()
        }

        return blog
    },

    update: async(id:string, updatedData: UpdateQuery<IBlog>):Promise<BlogLean | null> => {
        const newBlog = await Blog.findByIdAndUpdate(id, updatedData, { new: true }).lean().exec()
        if(!newBlog) return null

        const blog = {
            ... newBlog,
            _id:  newBlog._id.toString(),
            author: newBlog.author.toString()
        }

        return blog
    },

    deleteById: async (id:string): Promise<boolean> => {
        const result = await Blog.deleteOne({_id: id})
        return result.deletedCount === 1
    }
}