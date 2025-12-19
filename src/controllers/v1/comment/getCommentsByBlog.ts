/**
 * Node Modules
 */
import Blog from "@/models/blog"
import Comment, { IComment } from "@/models/comment"
import xss from 'xss'

/**
 * Custom Modules
*/
import catchAsync from "@/utils/catchAsync"
import logger from "@/lib/winston"
import ensureDocument from '../../../utils/ensureDocument'
/**
 * Middleware
 */
import { AppError } from "@/middleware/errorHandler"

/**
 * Types
 */
import { Request, Response } from "express"
import getOrSetRedis from "@/utils/getOrSetRedis"

const getCommentsByBlog =  catchAsync(async function (req:Request, res: Response): Promise<void>{
    const { blogId } = req.params


    const cacheKey = `Comment:${blogId}`

    const blog = await Blog.findById(blogId).lean().exec()

    ensureDocument(blog, 'Blog')

    const data = await getOrSetRedis(cacheKey, async () => {
        const allComments = await Comment.find({blogId}).sort({ createdAt: -1}).lean().exec()
        return allComments
    })
 
    logger.info('Comments successfully retreaved')
    res.status(200).json({
        allComments: data
    })
    return
})

export default getCommentsByBlog