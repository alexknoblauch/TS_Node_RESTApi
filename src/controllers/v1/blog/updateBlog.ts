
/**
 * Types
 */
import type { Request, Response } from 'express'
import blogService from '@/services/blog.service'
import { updateBlogSchema } from '@/dto/blog/updateBlog.schema'


const updateBlog = async(req: Request, res: Response) => {
    
    const dataObj = updateBlogSchema.parse(req.body)
    const userId = req.userId

    if(!userId) {
        return res.status(401).json({
            code: 'Unauthorized',
            message: 'User not authenticated'
        })
    }
    
    const blogId = req.params.blogId
    const blog = await blogService.updateBlog(userId, blogId, dataObj)

    res.status(200).json({ blog })
}

export default updateBlog