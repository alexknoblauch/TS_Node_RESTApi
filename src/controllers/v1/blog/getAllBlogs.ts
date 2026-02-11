/**
 * Models
 */
import  { BlogLean, IBlog } from "@/models/blog";

/**
 * Repos
 */
import blogService from "@/services/blog.service";
import catchAsync from "@/utils/async/catchAsync";
import { Request, Response } from "express";

/**
 * Types
 */
import { FilterQuery } from "mongoose";


const getAllBlogs = catchAsync (async(req: Request, res: Response):Promise<void> => {
            const limit = Number(req.query.limit) || 10
            const skip = Number(req.query.skip) || 0
            const query: FilterQuery<BlogLean> = {}

            if (req.userRole === 'user') {
                query.status = 'published'
            }
            
            const options = {
                skip,
                limit
            }
            
            const data = await blogService.getAllBlogs(query, options)

            res.status(200).json({
                code: 'ApiSuccess',
                message: 'Blogs successfully retrieved',
                blogs: data
            })
        })

export default getAllBlogs