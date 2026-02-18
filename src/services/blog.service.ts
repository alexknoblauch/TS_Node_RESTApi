import { CreateBlogDTO } from "@/dto/blog/createBlog.schema";
import { updateBlogDTO } from "@/dto/blog/updateBlog.schema";
import BlogBannerError from "@/errors/service/blog/BlogBannerError";
import BlogNoContent from "@/errors/service/blog/BlogNoContent";
import BlogNotFound from "@/errors/service/blog/BlogNotFound";
import BlogNoTitle from "@/errors/service/blog/BlogNoTitle";
import InsufficientPermissionsError from "@/errors/service/common/InsufficientPermissionsError";
import { BlogBase, BlogDocument, BlogLean, IBanner } from "@/models/blog";
import { blogRepository } from "@/repository/blogRepository/blogreposiroty";
import { userRepository } from "@/repository/userRepository/userRepository";
import { ensureDocument } from "@/utils/validation/ensureDocument";
import { FilterQuery, UpdateQuery } from "mongoose";
import xss from "xss";



const blogService = {
    createBlog: async function(credentials: CreateBlogDTO):Promise<BlogLean>  {

        let credentialsObj = {... credentials}
        credentialsObj.content = xss(credentialsObj.content)

        const newEntry = await blogRepository.create(credentialsObj)

        return newEntry
    },

    deleteBlog: async function(blogId: string, userId: string):Promise<void> {
        const user = await userRepository.findById(userId)
        ensureDocument(user, 'User')

        const blog = await blogRepository.findById(blogId)
        ensureDocument(blog, 'Blog')
        
        if(blog.author !== userId && user.role !== 'admin'){
            throw new InsufficientPermissionsError()
        }

        //await cloudenary.delet(......)        //IMG nicht vergessen zu deleten
    
        await blogRepository.deleteById(blogId)
    },

    getAllBlogs: async function(query: FilterQuery<BlogBase>, options: {skip: number, limit: number}):Promise<BlogLean[]> {
        const blogs = await blogRepository.find(query, {skip: options.skip, limit: options.limit})

        if(blogs.length === 0){
            return []                           // Leeres array weil filte immer [] returnt!
        }
        return blogs
    },

    getBlogBySlug: async function(userId: string, slug: string):Promise<BlogLean> {
        const user = await userRepository.findById(userId)
        ensureDocument(user, 'User')
        
        const data = await blogRepository.findBySlug(slug)
        ensureDocument(data, 'Data')
        
        if(user.role === 'user' && data.status === 'draft') {
            throw new InsufficientPermissionsError()
        }

        return data
    },

    getBlogsByUser: async function(userId: string, query: FilterQuery<BlogBase> , options: {queryId: string, skip: number, limit: number}): Promise<BlogLean[]> {
        const user = await userRepository.findById(userId)
        ensureDocument(user, 'User')

        const {queryId, skip, limit} = options
        
        if(user.role === 'user'){
            query.status = 'published'
        }
        
        const data = await blogRepository.find({author: queryId, ...query}, {skip, limit})

        if(!data || data.length === 0) {
            throw new BlogNotFound()
        }

        return data
    },

    updateBlog: async function(userId: string, blogId: string, data: UpdateQuery<updateBlogDTO>): Promise<BlogDocument>{
        const user = await userRepository.findById(userId)
        ensureDocument(user, 'User')

        const blog = await blogRepository.findDocumentById(blogId)
        ensureDocument(blog, 'Blog')

        const { title, content, banner, status } = data

        if(blog.author !== userId && user?.role !== 'admin') {

            throw new InsufficientPermissionsError()
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