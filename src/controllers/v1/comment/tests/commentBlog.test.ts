import CommentNoText from "@/errors/service/comment/CommentNoText"
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

const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>
const mockedCommentRepository = commentRepository as jest.Mocked<typeof commentRepository>
const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>


describe('commentBlog', () => {
    it('should create a comment', async() => {
        mockedBlogRepository.findById.mockResolvedValue({
            _id: '123',
            author: '1234'
        } as BlogLean)

        mockedUserRepository.findById.mockResolvedValue({
            _id: '1234'
        } as UserLean)

        mockedCommentRepository.create.mockResolvedValue({
            _id : '12345',
            userId: '1234',                    
            blogId: '123',                    
            comment: 'test' 
        } as CommentLean)

        const result = await commentService.createComment({
            userId: '1234',                    
            blogId: '123',                    
            comment: 'test' 
        })

        expect(mockedCommentRepository.create).toHaveBeenCalledWith({
            userId: '1234',                    
            blogId: '123',                    
            comment: 'test'
        })

        expect(result).toEqual({
            _id : '12345',
            userId: '1234',                    
            blogId: '123',                    
            comment: 'test' 
        })
    })

    it('should throw an Error when DB is down', async() => {
        mockedBlogRepository.findById.mockRejectedValue(new Error('DB not found'))

        await expect(commentService.createComment({
        userId: '1234',                    
            blogId: '123',                    
            comment: 'test' 
        })).rejects.toThrow('DB not found')
        
        expect(mockedCommentRepository.create).not.toHaveBeenCalled()
        expect(mockedUserRepository.findById).not.toHaveBeenCalled()
        expect(mockedBlogRepository.findById).not.toHaveBeenCalled()
    })

    it('whould throw null when blog not found', async() => {
        mockedBlogRepository.findById.mockResolvedValue(null)

        await expect(commentService.createComment({
        userId: '1234',                    
            blogId: '123',                    
            comment: 'test' 
        })).rejects.toThrow('Blog not found')

        expect(mockedCommentRepository.create).not.toHaveBeenCalled()
        expect(mockedUserRepository.findById).not.toHaveBeenCalled()

    })
    
    it('whould throw null when blog not found', async() => {
        mockedBlogRepository.findById.mockResolvedValue({
            _id: '123',
            author: '1234'
        } as BlogLean)

        mockedUserRepository.findById.mockResolvedValue(null)

        await expect(commentService.createComment({
        userId: '1234',                    
            blogId: '123',                    
            comment: 'test' 
        })).rejects.toThrow('User not found')

        expect(mockedCommentRepository.create).not.toHaveBeenCalled()

    })

    it('should throw en Error when no content', async () => {
        mockedBlogRepository.findById.mockResolvedValue({
            _id: '123',
            author: '1234'
        } as BlogLean)

        mockedUserRepository.findById.mockResolvedValue({
            _id: '1234'
        } as UserLean)

        await expect(commentService.createComment({
            userId: '1234',                    
            blogId: '123',                    
            comment: '' 
        })).rejects.toThrow(CommentNoText)

        expect(mockedCommentRepository.create).not.toHaveBeenCalled()
    })

    it('should throw en Error when content not string', async () => {
        mockedBlogRepository.findById.mockResolvedValue({
            _id: '123',
            author: '1234'
        } as BlogLean)

        mockedUserRepository.findById.mockResolvedValue({
            _id: '1234'
        } as UserLean)

        await expect(commentService.createComment({
            userId: '1234',                    
            blogId: '123',                    
            comment: undefined as any
        })).rejects.toThrow(CommentNoText)

        expect(mockedCommentRepository.create).not.toHaveBeenCalled()
    })
})