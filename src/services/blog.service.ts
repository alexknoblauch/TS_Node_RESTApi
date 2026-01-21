import getBlogBySlug from "@/controllers/v1/blog/getBlogBySlug";
import logger from "@/lib/winston";
import { AppError } from "@/middleware/errorHandler";
import { IBanner, IBlog } from "@/models/blog";
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
        const blogs = await blogRepository.find(query, {skip: options.skip, limit: options.limit})

        if(!blogs || blogs.length === 0){
            logger.info('No Blogs founnd',{
                blogs,
            })

            return []                           // Leeres array weil filte immer [] returnt!
        }

        return blogs
    },

    getBlogBySlug: async function(userId: string, slug: string) {
        const user = await userRepository.findById(userId)
    
        if(!user) { 
            const error = new Error('User not found for role settnigs') as AppError
            error.statusCode = 404                                                  //Rolle vergeben
            error.code = 'ApiError'
            throw error
        } 
        
        const data = await blogRepository.findBySlug(slug)
        
        data?.map(data => {
            if(user.role === 'user'&& data?.status === 'draft'){
                logger.warn('A User tried to access Draft Blog')
                throw new Error('User can not access Draft Blog')
            }
            

            if(!data){
                const error = new Error('No Blogs found for slug') as AppError
                error.statusCode = 404
                error.code = 'ApiError'
                throw error
            }
        })

        return data
    },

    getBlogsByUser: async function(userId: string, query: FilterQuery<IBlog> , options: {queryId: string, skip: number, limit: number}): Promise<IBlog[]> {
        const user = await userRepository.findById(userId)

        const {queryId, skip, limit} = options
        
        if(!user) { 
            const error = new Error('User not found for role settnigs') as AppError
            error.statusCode = 404                                                          //Rolle vergeben
            error.code = 'ApiError'
            throw error
        }

        if(user.role === 'user'){
            query.status = 'published'
        }
        
        const data = await blogRepository.find({author: queryId, ...query}, {skip, limit})

        if(!data || data.length === 0){
            const error = new Error('No Blogs found for user') as AppError
            error.statusCode = 404
            error.code = 'ApiError'
            throw error
        }

        return data
    },

    updateBlog: async function(userId: string, blogId: string, data: { title?: string, content?: string, banner?: IBanner, status?: 'draft' | 'publicated' }): Promise<IBlog>{
        const user = await userRepository.findById(userId)
        const blog = await blogRepository.findById(blogId)
        const { title, content, banner, status } = data

        if(!blog){
            const error = new Error('No blog found with this ID') as AppError;
            error.statusCode = 404;
            error.code = 'BlogNotFound';
            throw error;
        }

        if(blog.author !== userId && user?.role !== 'admin'){
            logger.warn('User tried to update a Blog without haveing permission', {
                userId,
                blog
            })

            const error = new Error('Access denied') as AppError;
            error.statusCode = 403;
            error.code = 'AuthorizationError';
            throw error; 
        }

        if(title) blog.title = title
        if(content) {
            const cleanContent = xss(content)
            blog.content = cleanContent
        }

        if(banner) blog.banner = banner
        if(status) blog.status = status

        return blog as IBlog
    }
}

export default blogService