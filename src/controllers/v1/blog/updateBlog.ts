
/**
 * Types
 */
import type { Request, Response } from 'express'
import type { IBlog } from '@/models/blog'
import blogService from '@/services/blog.service'

type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status' >>

const updateBlog = async(req: Request, res: Response) => {
    
            const dataObj = req.body as BlogData


            if(req.body == null) return
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