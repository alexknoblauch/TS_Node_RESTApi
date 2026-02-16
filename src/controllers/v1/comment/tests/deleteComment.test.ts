import InsufficientPermissionsError from "@/errors/service/common/InsufficientPermissionsError"
import InvalidCredentials from "@/errors/service/common/InvalidCredentials"
import { CommentLean } from "@/models/comment"
import { UserLean } from "@/models/user"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { commentRepository } from "@/repository/commentRepository/commentRepository"
import { userRepository } from "@/repository/userRepository/userRepository"
import blogService from "@/services/blog.service"
import commentService from "@/services/comment.service"

jest.mock('@repository/userRepository/userRepository')
jest.mock('@repository/commentRepository/commentRepository')
jest.mock('@repository/blogRepository/blogRepository')

const mockedBlogRepositry = blogRepository as jest.Mocked<typeof blogRepository>
const mockedUserRepositry = userRepository as jest.Mocked<typeof userRepository>
const mockedCommentRepositry = commentRepository as jest.Mocked<typeof commentRepository>

describe('deletComment', () => {
    it('should delete a Comment', async () => {
        mockedCommentRepositry.findById.mockResolvedValue({
            _id: '123',
            comment: 'test',
            blogId: '12345',
            userId: '1234'
        } as CommentLean)

        mockedUserRepositry.findById.mockResolvedValue({
            _id: '1234',
            role: 'user'
        } as UserLean)

        mockedCommentRepositry.deleteById.mockResolvedValue(true)

        const result = await commentService.deleteComment('1234', '123')

        expect(result).toBe(true)
    })


    it('should throw an Error when DB is not available', async() => {
        mockedCommentRepositry.findById.mockRejectedValue(new Error('DB not found'))

        await expect(commentService.deleteComment('1234', '123')).rejects.toThrow('DB not found')
    })

    it('should throw an Error when DB is not available', async() => {
        mockedCommentRepositry.findById.mockResolvedValue({
            _id: '123',
            comment: 'test',
            blogId: '12345',
            userId: '1234'
        } as CommentLean)

        mockedUserRepositry.findById.mockRejectedValue(new Error('DB not found'))

        await expect(commentService.deleteComment('1234', '123')).rejects.toThrow('DB not found')
    })

    
    it('should throw an Error when DB is not available', async() => {
        mockedCommentRepositry.findById.mockResolvedValue({
            _id: '123',
            comment: 'test',
            blogId: '12345',
            userId: '1234'
        } as CommentLean)

        mockedUserRepositry.findById.mockResolvedValue({
            _id: '1234',
            role: 'user'
        } as UserLean)

        mockedCommentRepositry.deleteById.mockRejectedValue(new Error('DB not found'))
        
        await expect(commentService.deleteComment('1234', '123')).rejects.toThrow('DB not found')
    })


    it('should throw an Error when User is not owner of Blog', async() => {
        mockedCommentRepositry.findById.mockResolvedValue({
            _id: '123',
            comment: 'test',
            blogId: '12345',
            userId: '4321'
        } as CommentLean)

        mockedUserRepositry.findById.mockResolvedValue({
            _id: '1234',
            role: 'user'
        } as UserLean)

        await expect(commentService.deleteComment('1234', '123')).rejects.toThrow(InsufficientPermissionsError)
    })
})
