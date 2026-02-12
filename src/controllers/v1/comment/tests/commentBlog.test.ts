import BlogNotFound from "@/errors/service/blog/BlogNotFound"
import UserNotFound from "@/errors/service/user/UserNotFound"
import { BlogLean } from "@/models/blog"
import { UserLean } from "@/models/user"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { commentRepository } from "@/repository/commentRepository/commentRepository"
import { userRepository } from "@/repository/userRepository/userRepository"
import blogService from "@/services/blog.service"
import commentService from "@/services/comment.service"

jest.mock('@repository/commentRepository/commentRepository')
jest.mock('@repository/blogRepository/blogRepository')
jest.mock('@repository/userRepository/userRepository')

const mockedCommentRepositry = commentRepository as jest.Mocked<typeof commentRepository>
const mockedBlogRepositry = blogRepository as jest.Mocked<typeof blogRepository>
const mockedUsertRepositry = userRepository as jest.Mocked<typeof userRepository>

describe('commentBlog', () => {
    it('should create a comment', async() =>{
        mockedBlogRepositry.findById.mockResolvedValue({
            _id: '123',
            author: '1234'
        } as BlogLean)

        mockedUsertRepositry.findById.mockResolvedValue({
            _id: '1234',
            role: 'user'
        } as UserLean)

        mockedCommentRepositry.create.mockResolvedValue({
            _id: '12345',
            blogId:'123',
            userId:'1234',
            comment:'test'
        })

        const result = await commentService.createComment({
            blogId: '123',
            userId: '1234',
            comment: 'test'
        })

        expect(result).toEqual({
            _id: '12345',
            blogId:'123',
            userId:'1234',
            comment:'test'
        })
    })


    it('should throw an Error when DB is not available', async() => {
        mockedBlogRepositry.findById.mockResolvedValue({
            _id: '123',
            author: '1234'
        } as BlogLean)

        mockedUsertRepositry.findById.mockResolvedValue({
            _id: '1234',
            role: 'user'
        } as UserLean)

        mockedCommentRepositry.create.mockRejectedValue(new Error('DB not found'))

        await expect(commentService.createComment({
            blogId: '123',
            userId: '1234',
            comment: 'test'
        })).rejects.toThrow('DB not found')
    })

    
    it('should throw an Error when DB is not available', async() => {
        mockedBlogRepositry.findById.mockResolvedValue({
            _id: '123',
            author: '1234'
        } as BlogLean)

        mockedUsertRepositry.findById.mockRejectedValue(new Error('DB not found'))

        await expect(commentService.createComment({
            blogId: '123',
            userId: '1234',
            comment: 'test'
        })).rejects.toThrow('DB not found')
    })
    
    it('should throw an Error when DB is not available', async() => {
        mockedBlogRepositry.find.mockRejectedValue(new Error('DB not found'))

        await expect(commentService.createComment({
            blogId: '123',
            userId: '1234',
            comment: 'test'
        })).rejects.toThrow('DB not found')
    })


    it('should throw an Error when Blog not found', async() => {
        mockedBlogRepositry.findById.mockResolvedValue(null)

        await expect(commentService.createComment({
            blogId: '123',
            userId: '1234',
            comment: 'test'
        })).rejects.toThrow(BlogNotFound)
    })


    it('should throw an Error when User not found', async() => {
        mockedBlogRepositry.findById.mockResolvedValue({
            _id: '123',
            author: '1234'
        } as BlogLean)

        mockedUsertRepositry.findById.mockResolvedValue(null)

        await expect(commentService.createComment({
            blogId: '123',
            userId: '1234',
            comment: 'test'
        })).rejects.toThrow(UserNotFound)
    })


    it('should throw an Error when Comment is empty', async() => {
         mockedBlogRepositry.findById.mockResolvedValue({
            _id: '123',
            author: '1234'
        } as BlogLean)

        mockedUsertRepositry.findById.mockResolvedValue({
            _id: '1234',
            role: 'user'
        } as UserLean)

        mockedCommentRepositry.create.mockRejectedValue(new Error('Comment Field is empty'))

        await expect(commentService.createComment({blogId: '123', userId: '1234', comment: ''})).rejects.toThrow('Comment Field is empty')
    })


    //XXS TEST:
})