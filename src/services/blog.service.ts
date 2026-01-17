import logger from "@/lib/winston";
import { AppError } from "@/middleware/errorHandler";
import { IBlog } from "@/models/blog";
import { blogRepository } from "@/repository/blogRepository/blogreposiroty";
import { userRepository } from "@/repository/userRepository/userRepository";
import { FilterQuery } from "mongoose";
import xss from "xss";

interface CreateBlog {
    title: string,
    content: string,
    banner: {
        publicId: string; 
        url: string; 
        width: number; 
        height: number; 
    }
    author: string,
}

const blogService = {
    createBlog: async function(credentials: CreateBlog)  {
    let credentialsObj = {... credentials}
    credentialsObj.content = xss(credentialsObj.content)

    const newEntry = await blogRepository.create(credentialsObj)

    if(newEntry == null){
        const error = new Error('create new Blog not worked') as AppError;
        error.statusCode = 400;
        error.code = 'BlogNotCreateds';
        throw error;
    }

    return newEntry
    },
    deleteBlog: async function(userId: string, blogId: string) {
        const user = await userRepository.findById(userId)

        if(!user){
            const error = new Error(`No User found with id ${userId}`) as AppError;
            error.statusCode = 400;
            error.code = 'UserNotFound';
            throw error;
        }

        const blog = await blogRepository.findById(blogId)

        if(!blog){
            const error = new Error(`No Blog found with id ${blogId}`) as AppError;
            error.statusCode = 400;
            error.code = 'BlogNotFound';
            throw error;
        }

        if(blog?.author !== userId && user?.role !== 'admin'){
            logger.warn('someone tried to delete blog without acceess',{
                blog,
                userId
            })

            const error = new Error(`Pessmissions for delte blog denies`) as AppError;
            error.statusCode = 400;
            error.code = 'AccessError';
            throw error;
        }

        //await cloudenary.delet(......)        //IMG nicht vergessen zu deleten
        
        await blogRepository.deleteById(userId)
    },
    getAllBlogs: async function(query: FilterQuery<IBlog>, options: {skip: number, limit: number}):Promise<IBlog[]> {
        let blogs
        blogs = await blogRepository.find(query, {skip: options.skip, limit: options.limit})



        return blogs
    }
}

export default blogService