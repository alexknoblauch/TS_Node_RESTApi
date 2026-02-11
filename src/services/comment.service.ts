import logger from "@/lib/winston";
import { CommentCreateDTO, CommentLean, IComment } from "@/models/comment";
import { blogRepository } from "@/repository/blogRepository/blogreposiroty";
import { commentRepository } from "@/repository/commentRepository/commentRepository";
import xss from "xss";

import { userRepository } from "@/repository/userRepository/userRepository";
import { ensureDocument } from "@/utils/validation/ensureDocument";
import InsufficientPermissionsError from "@/errors/service/common/InsufficientPermissionsError";

const commentService = {
    createComment: (async function (credentials: CommentCreateDTO): Promise<CommentLean>{
        const {userId, blogId, comment} = credentials

        const blog = await blogRepository.findById(blogId)
        ensureDocument(blog, 'Blog')

        const user = await userRepository.findById(userId)
        ensureDocument(user, 'User')

        const cleanComment = xss(comment)

        const createdComment = await commentRepository.create({ 
            userId: userId,                    //string to OObjectId machen!!
            blogId: blogId,                    //string to OObjectId machen!!
            comment: cleanComment 
        })
        
        logger.info('Comment successfully created')

        return createdComment
    }),
    

    getCommentsByBlog: (async function (blogId: string): Promise<CommentLean[]>{
        const blog = await blogRepository.findById(blogId)
        ensureDocument(blog, 'Blog')

        const allComments = await commentRepository.find({ blogId })

        logger.info('Comments successfully retreaved')

        return allComments
    }),


    deleteComment: (async function (userId: string, commentId: string): Promise<void>{
        const comment = await commentRepository.findById(commentId) as any        //wegen toString()
        ensureDocument(comment, 'Comment')

        const user = await userRepository.findById(userId)
        ensureDocument(user, 'User')

        if(comment.userId.toString() !== userId && user.role !== 'admin' ) {
            logger.error('User tried to delete a comment without permission')
            throw new InsufficientPermissionsError()
        }       

        await commentRepository.deleteById(commentId)
        await blogRepository.update(comment.blogId, {                      // comment.blogId = Realtion!!
            $inc: {likesCount: -1}
        })

        logger.info('Comment successfully deleted')
    })
}

export default commentService