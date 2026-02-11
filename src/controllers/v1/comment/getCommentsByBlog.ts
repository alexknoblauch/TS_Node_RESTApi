/**
 * Types
 */
import { Request, Response } from "express"
/**
 * Service
 */
import commentService from "@/services/comment.service"
import catchAsync from "@/utils/async/catchAsync"
import getOrSetRedis from "@/infra/cache/getOrSetRedis"


const getCommentsByBlog = catchAsync(async(req: Request, res: Response) => {
    const { blogId } = req.params                               

    const cacheKey = `Blog:${blogId}`

    const data = await getOrSetRedis(cacheKey, async() => {
        return await commentService.getCommentsByBlog(blogId)
    })

    res.status(200).json({
        allComments: data
    })
})

export default getCommentsByBlog