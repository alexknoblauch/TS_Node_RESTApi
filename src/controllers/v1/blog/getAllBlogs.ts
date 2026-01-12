/**
 * Models
 */
import  { IBlog } from "@/models/blog";

/**
 * Repos
 */
import { blogRepository } from "@/repository/blogreposiroty";

/**
 * Types
 */
import { FilterQuery } from "mongoose";


const getAllBlogs = (async function(query: FilterQuery<IBlog>, skip: number, limit: number): Promise<IBlog[]>{
        const blogs = await blogRepository.find(query, {skip, limit})

        if(!blogs || blogs.length === 0) console.log('No Blogs found')

        return blogs
})

export default getAllBlogs