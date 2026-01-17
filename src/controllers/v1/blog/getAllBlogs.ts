/**
 * Models
 */
import  { BlogResponse, IBlog } from "@/models/blog";

/**
 * Repos
 */
import { blogRepository } from "@/repository/blogRepository/blogreposiroty";
import blogService from "@/services/blog.service";
import catchAsync from "@/utils/catchAsync";
import { Request, Response } from "express";

/**
 * Types
 */
import { FilterQuery } from "mongoose";


const getAllBlogs = catchAsync (async(req: Request, res: Response):Promise<void> => {
            const limit = Number(req.query) || 10
            const skip = Number(req.query) || 0
            const query: FilterQuery<IBlog> = {}
            
            const options = {
                query,
                skip,
                limit
            }

            if (req.userRole === 'user') {
                query.status = 'published'
            }
            
            const data = await blogService.getAllBlogs(query, options)

            res.status(200).json({
                code: 'ApiSuccess',
                message: 'Blogs successfully retrieved',
                blogs: data
            })
        })

export default getAllBlogs