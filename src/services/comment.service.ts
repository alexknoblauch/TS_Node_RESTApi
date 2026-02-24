import logger from "@/lib/winston";
import { CommentLean } from "@/models/comment";
import { blogRepository } from "@/repository/blogRepository/blogreposiroty";
import { commentRepository } from "@/repository/commentRepository/commentRepository";
import xss from "xss";

import { userRepository } from "@/repository/userRepository/userRepository";
import { ensureDocument } from "@/utils/validation/ensureDocument";
import InsufficientPermissionsError from "@/errors/service/common/InsufficientPermissionsError";
import CommentNotFound from "@/errors/service/comment/CommentNotFound";
import CommentNoText from "@/errors/service/comment/CommentNoText";
import { CommentCreateDTO } from "@/dto/comment/createComment.schema";

const commentService = {
    createComment: (async function (credentials: CommentCreateDTO): Promise<CommentLean>{
        const {userId, blogId, comment} = credentials

        const blog = await blogRepository.findById(blogId)
        ensureDocument(blog, 'Blog')

        const user = await userRepository.findById(userId)
        ensureDocument(user, 'User')

        if(!comment || typeof comment !== 'string'){
            throw new CommentNoText()
        }

        const cleanComment = xss(comment)

        const createdComment = await commentRepository.create({ 
            userId: userId,                    //string to OObjectId machen!!
            blogId: blogId,                    //string to OObjectId machen!!
            comment: cleanComment 
        })
        
        return createdComment
    }),
    

    getCommentsByBlog: (async function (blogId: string): Promise<CommentLean[]>{
        const blog = await blogRepository.findById(blogId)
        ensureDocument(blog, 'Blog')

        const allComments = await commentRepository.find({ blogId })

        return allComments
    }),


    deleteComment: (async function (userId: string, commentId: string): Promise<void>{
        const comment = await commentRepository.findById(commentId) as any        //wegen toString()
        ensureDocument(comment, 'Comment')

        const user = await userRepository.findById(userId)
        ensureDocument(user, 'User')

        if(comment.userId.toString() !== userId && user.role !== 'admin' ) {
            throw new InsufficientPermissionsError()
        }       

        await commentRepository.deleteById(commentId)
        await blogRepository.update(comment.blogId, {                      // comment.blogId = Realtion!!
            $inc: {likesCount: -1}
        })
    })
}

export default commentService