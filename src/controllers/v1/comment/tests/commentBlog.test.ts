jest.mock('@/repository/commentRepository')
jest.mock('@/repository/userRepository')
jest.mock('@/repository/blogRepository')

import { commentRepository } from "@/repository/commentRepository/commentRepository"
import { userRepository } from "@/repository/userRepository/userRepository"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { IUser } from "@/models/user"
import { IBlog } from "@/models/blog"
import commentBlog from "../commentBlog"
import { IComment } from "@/models/comment"

const MockCommentRepository = commentRepository as jest.Mocked<typeof commentRepository>
const MockUserRepository = userRepository as jest.Mocked<typeof userRepository>
const MockBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>

describe('commentBlog', () => {
    it('should create a comment', async() => {
        MockUserRepository.findById.mockResolvedValue({
            _id: 'user123'
        } as IUser)

        MockBlogRepository.findById.mockResolvedValue({
            _id: 'blog123'
        } as IBlog)

        MockCommentRepository.create.mockResolvedValue({
            _id: '1234',                                       //userID wird created muss ich hier schreiben
            userId: 'user123',
            blogId: 'blog123',
            comment: 'jfekfjekkfkejfe'
        } as IComment)

        const result = await commentBlog('user123', 'blog123', 'jfekfjekkfkejfe')

        expect(MockCommentRepository.create).toHaveBeenCalledWith({
            userId: 'user123',
            blogId: 'blog123',
            comment: 'jfekfjekkfkejfe'  
        })

        expect(result).toEqual({
            _id: '1234',                              //_id wieder vermerken!
            userId: 'user123',
            blogId: 'blog123',
            comment: 'jfekfjekkfkejfe'   
        })
    }),


    it('should throw an error when DB not available', async() => {
        MockUserRepository.findById.mockResolvedValue({
            _id: 'user123'
        } as IUser)

        MockBlogRepository.findById.mockResolvedValue({
            _id: 'blog123'
        } as IBlog)

        MockCommentRepository.create.mockRejectedValue(new Error('DB not available'))

        await expect(commentBlog('user123', 'blog123', 'jfekfjekkfkejfe')).rejects.toThrow('DB not available')
    })

    
    //
    //
    // Kein null check bei create, nur bei find !!

})