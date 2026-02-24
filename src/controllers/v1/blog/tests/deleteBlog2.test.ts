import BlogNotFound from "@/errors/service/blog/BlogNotFound"
import InsufficientPermissionsError from "@/errors/service/common/InsufficientPermissionsError"
import UserNotFound from "@/errors/service/user/UserNotFound"
import { BlogLean } from "@/models/blog"
import { UserLean } from "@/models/user"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { userRepository } from "@/repository/userRepository/userRepository"
import blogService from "@/services/blog.service"

jest.mock('@repository/userRepository')
jest.mock('@repository/blogRepository')


const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>
const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>

describe('deleteBlog', () => {
    it('should delete a Blog', async() => {
        mockedUserRepository.findById.mockResolvedValue({
            _id: '123',
        } as UserLean)

        mockedBlogRepository.findById.mockResolvedValue({
            _id: '1234',
            author: '123'
        } as BlogLean)

        const result = await blogService.deleteBlog('1234', '123')

        expect(mockedBlogRepository.deleteById).toHaveBeenCalledWith('1234')

        expect(result).toEqual({
            _id: '1234',
            author: '123'
        })
    })

    it('should throw an Error when Author is not owner', async() => {
        mockedUserRepository.findById.mockResolvedValue({
            _id: '123',
        } as UserLean)

        mockedBlogRepository.findById.mockResolvedValue({
            _id: '1234',
            author: '123'
        } as BlogLean)

        await expect(blogService.deleteBlog('1234', '999')).rejects.toThrow(InsufficientPermissionsError)
        expect(blogRepository.deleteById).not.toHaveBeenCalled()
    })

    it('should throw an Error when DB is down', async() => {
        mockedUserRepository.findById.mockRejectedValue(new Error('DB not found'))

        await expect(blogService.deleteBlog('1234', '123')).rejects.toThrow('DB not found')
        expect(blogRepository.findById).not.toHaveBeenCalled()
        expect(blogRepository.deleteById).not.toHaveBeenCalled()
    })

    it('should throw an Error when Blog is not found', async() => {
        mockedUserRepository.findById.mockResolvedValue({
            _id: '123',
        } as UserLean)

        mockedBlogRepository.findById.mockResolvedValue(null)

        await expect(blogService.deleteBlog('1234', '999')).rejects.toThrow(BlogNotFound)
        expect(blogRepository.deleteById).not.toHaveBeenCalled()
    })

    it('should throw an Error when User is not found', async() => {
        mockedUserRepository.findById.mockResolvedValue(null)

        await expect(blogService.deleteBlog('1234', '999')).rejects.toThrow(UserNotFound)
        expect(blogRepository.deleteById).not.toHaveBeenCalled()
    })

    
})