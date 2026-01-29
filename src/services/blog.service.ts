import logger from "@/lib/winston";
import { AppError } from "@/middleware/errorHandler";
import { BlogLean, CreateBlogDTO, IBanner, IBlog, UpdateBlogDTO } from "@/models/blog";
import { blogRepository } from "@/repository/blogRepository/blogreposiroty";
import { userRepository } from "@/repository/userRepository/userRepository";
import { ensureDocument } from "@/utils/validation/ensureDocument";
import { FilterQuery } from "mongoose";
import xss from "xss";



const blogService = {
    createBlog: async function(credentials: CreateBlogDTO)  {
        let credentialsObj = {... credentials}
        credentialsObj.content = xss(credentialsObj.content)

        const newEntry = await blogRepository.create(credentialsObj)

        return newEntry
    },

    deleteBlog: async function(userId: string, blogId: string) {
        const user = await userRepository.findById(userId)
        ensureDocument(user, 'User')


        const blog = await blogRepository.findById(blogId)
        ensureDocument(blog, 'Blog')
        
        if(blog.author !== userId && user.role !== 'admin'){
            logger.warn('someone tried to delete blog without acceess',{
                blog,
                userId
            })

            const error = new Error(`Pessmissions for delte blog denies`) as AppError;
            error.statusCode = 403;
            error.code = 'AuthorizationError';
            throw error;
        }

        //await cloudenary.delet(......)        //IMG nicht vergessen zu deleten
        
        await blogRepository.deleteById(blogId)
    },

    getAllBlogs: async function(query: FilterQuery<IBlog>, options: {skip: number, limit: number}):Promise<BlogLean[]> {
        const blogs = await blogRepository.find(query, {skip: options.skip, limit: options.limit})

        if(blogs.length === 0){
            logger.info('No Blogs founnd',{
                blogs,
            })

            return []                           // Leeres array weil filte immer [] returnt!
        }
        return blogs
    },

    getBlogBySlug: async function(userId: string, slug: string) {
        const user = await userRepository.findById(userId)
        ensureDocument(user, 'User')
        
        const data = await blogRepository.findBySlug(slug)
        ensureDocument(data, 'Data')
        
        if(user.role === 'user'&& data.status === 'draft') {
            logger.warn('A User tried to access Draft Blog')
            throw new Error('User can not access Draft Blog')
        }

        return data
    },

    getBlogsByUser: async function(userId: string, query: FilterQuery<IBlog> , options: {queryId: string, skip: number, limit: number}): Promise<BlogLean[]> {
        const user = await userRepository.findById(userId)
        ensureDocument(user, 'User')

        const {queryId, skip, limit} = options
        
        if(user.role === 'user'){
            query.status = 'published'
        }
        
        const data = await blogRepository.find({author: queryId, ...query}, {skip, limit})

        if(!data || data.length === 0) {
            const error = new Error('No Blogs found for user') as AppError
            error.statusCode = 404
            error.code = 'ApiError'
            throw error
        }

        return data
    },

    updateBlog: async function(userId: string, blogId: string, data: { title?: string, content?: string, banner?: IBanner, status?: 'draft' | 'published' }): Promise<UpdateBlogDTO>{
        const user = await userRepository.findById(userId)
        ensureDocument(user, 'User')

        const blog = await blogRepository.findById(blogId)
        ensureDocument(blog, 'Blog')

        const { title, content, banner, status } = data

        if(blog.author !== userId && user?.role !== 'admin') {
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

        return blog
    }
}

export default blogService