import logger from "@/lib/winston";
import { AppError } from "@/middleware/errorHandler";
import { CommentLean, IComment } from "@/models/comment";
import { blogRepository } from "@/repository/blogRepository/blogreposiroty";
import { commentRepository } from "@/repository/commentRepository/commentRepository";
import xss from "xss";

import { Types } from 'mongoose'
import { userRepository } from "@/repository/userRepository/userRepository";

const commentService = {
    createComment: (async function (userId: string, blogId: string, comment: string): Promise<IComment>{

        const blog = await blogRepository.findById(blogId)

        if(!blog){
            logger.error('Blog not found')
            const error = new Error('Blog not found') as AppError;
            error.statusCode = 404;
            error.code = 'BlogNotFound';
            throw error;
        }

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

        if(!blog ){
            logger.error('Blog not found')
            const error = new Error('Blog not found') as AppError;
            error.statusCode = 404;
            error.code = 'BlogNotFound';
            throw error;
        }

        const allComments = await commentRepository.find({_id: blogId})

        logger.info('Comments successfully retreaved')

        return allComments
    }),

    deleteComment: (async function (userId: string, commentId: string): Promise<void>{

        const comment = await commentRepository.find({_id: commentId}) as any        //wegen toString()
        const user = await userRepository.findById(userId)

        if(!comment){
            logger.error('Comment not found')
            const error = new Error('Comment not found') as AppError;
            error.statusCode = 404;
            error.code = 'CommentNotFound';
            throw error;
        }

        if(!user){
            logger.error('User not found')
            const error = new Error('User not found') as AppError;
            error.statusCode = 404;
            error.code = 'UserNotFound';
            throw error;
        }

        if(comment.userId.toString() !== userId && user.role !== 'admin' ) {
            logger.error('User tried to delete a comment without permission')
            const error = new Error('User tried to delete a comment without permission') as AppError;
            error.statusCode = 403;
            error.code = 'UserNotFound';
            throw error;
        }       

        await commentRepository.deleteById(commentId)
        await blogRepository.update(comment.blogId, {                      // comment.blogId = Realtion!!
            $inc: {likesCount: -1}
        })

        logger.info('Comment successfully deleted')
    })
}

export default commentService