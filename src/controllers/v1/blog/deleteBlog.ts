/**
 * Custom Modules
*/
import catchAsync from "@/utils/catchAsync" 
/**
 * Types
 */
import type { Request, Response } from 'express'
import blogService from '@/services/blog.service'


const deleteBlog = catchAsync(async(req: Request, res: Response) => {
    const userId = req.userId as string
    const blogId = req.params.blogId 

    await blogService.deleteBlog(userId, blogId)

    res.sendStatus(204)
})

export default deleteBlog