import BlogNotFound from "@/errors/service/blog/BlogNotFound"
import CommentNotFound from "@/errors/service/comment/CommentNotFound"
import UserNotFound from "@/errors/service/user/UserNotFound"
import { BlogLean } from "@/models/blog"
import { CommentLean } from "@/models/comment"
import { UserLean } from "@/models/user"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { commentRepository } from "@/repository/commentRepository/commentRepository"
import { userRepository } from "@/repository/userRepository/userRepository"
import commentService from "@/services/comment.service"

jest.mock('@repository/commentRepository')
jest.mock('@repository/userRepository')
jest.mock('@repository/blogRepository')

const mockedBlogRespository = blogRepository as jest.Mocked<typeof blogRepository>
const mockedCommentRespository = commentRepository as jest.Mocked<typeof commentRepository>
const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>

describe('commentBlog', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should create a Comment', async () => {
        mockedBlogRespository.findById.mockResolvedValue({
            _id: '12345',
            author: '1234'
        } as BlogLean)

        mockedUserRepository.findById.mockResolvedValue({
            _id: '1234'
        } as UserLean)
        
        mockedCommentRespository.create.mockResolvedValue({
            _id: '123',
            userId: '1234',
            blogId: '12345',
            comment: 'test'
        } as CommentLean)

        const result = await commentService.createComment({blogId: '12345', userId: '1234', comment: 'test'})
        
        expect(mockedCommentRespository.create).toHaveBeenLastCalledWith({blogId: '12345', userId: '1234', comment: 'test'})

        expect(result).toEqual({
            _id: '123',
            userId: '1234',
            blogId: '12345',
            comment: 'test'
        })
    })

    it('should throw an Error when DB not available', async() => {
        mockedBlogRespository.findById.mockRejectedValue(new Error('DB not found'))

        await expect(commentService.createComment({blogId: '12345', userId: '1234', comment: 'test'})).rejects.toThrow('DB not found')

        expect(mockedCommentRespository.create).not.toHaveBeenCalled()
        expect(mockedUserRepository.findById).not.toHaveBeenCalled()
    })

    it('should throw an Error when Blog not found', async() => {
        mockedBlogRespository.findById.mockResolvedValue(null)

        await expect(commentService.createComment({blogId: '12345', userId: '1234', comment: 'test'})).rejects.toThrow(BlogNotFound)

        expect(mockedCommentRespository.create).not.toHaveBeenCalled()

    })
    
    it('should throw an Error when User not found', async() => {
        mockedBlogRespository.findById.mockResolvedValue({
            _id: '12345',
            author: '1234'
        } as BlogLean)

        mockedUserRepository.findById.mockResolvedValue(null)

        await expect(commentService.createComment({blogId: '12345', userId: '1234', comment: 'test'})).rejects.toThrow(UserNotFound)

        expect(mockedCommentRespository.create).not.toHaveBeenCalled()
    })

    it('should thorw an Error when no comment-text fails', async() => {
                mockedBlogRespository.findById.mockResolvedValue({
            _id: '12345',
            author: '1234'
        } as BlogLean)

        mockedUserRepository.findById.mockResolvedValue({
            _id: '1234'
        } as UserLean)
        
        await expect(commentService.createComment({blogId: '12345', userId: '1234', comment: ''})).rejects.toThrow(CommentNotFound)

        expect(mockedCommentRespository.create).not.toHaveBeenCalled()
    })


    it('thorws an Error when creation failes', async() => {
         mockedBlogRespository.findById.mockResolvedValue({
            _id: '12345',
            author: '1234'
        } as BlogLean)

        mockedUserRepository.findById.mockResolvedValue({
            _id: '1234'
        } as UserLean)
        
        mockedCommentRespository.create.mockRejectedValue(new Error('creation failed'))

        await expect(commentService.createComment({blogId: '12345', userId: '1234', comment: 'test'})).rejects.toThrow('creation failed')
    })
})