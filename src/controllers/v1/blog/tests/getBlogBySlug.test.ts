import BlogNotFound from "@/errors/service/blog/BlogNotFound"
import InsufficientPermissionsError from "@/errors/service/common/InsufficientPermissionsError"
import { BlogLean } from "@/models/blog"
import { UserLean } from "@/models/user"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { userRepository } from "@/repository/userRepository/userRepository"
import blogService from "@/services/blog.service"

jest.mock('@/repository/userRepository/userRepository')
jest.mock('@/repository/blogRepository/blogRepository')

const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>
const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>


describe('getBlogBySlug', () => {
    it('should get a Blog by Slug', async() => {
        mockedUserRepository.findById.mockResolvedValue({
            _id: '1234', 
        } as UserLean)

        mockedBlogRepository.findBySlug.mockResolvedValue({
            _id: '123',
            author: '1234',
            slug: 'slug-slug'
        } as BlogLean)

        const result = await blogService.getBlogBySlug('1234', 'slug-slug')

        expect(result).toEqual({
            _id: '123',
            author: '1234',
            slug: 'slug-slug'
        })
    })

    it('should trhow an Error when DB not found', async() => {
        mockedBlogRepository.findBySlug.mockRejectedValue(new Error('DB not found'))

        await expect(blogService.getBlogBySlug('123', '1234')).rejects.toThrow('DB not found')
    })

    it('should thow an Error when User not found', async() => {
        mockedUserRepository.findById.mockResolvedValue(null)

        await expect(blogService.getBlogBySlug('123', '1234')).rejects.toThrow('User not found')
    })

    it('should throw an Error when Blog is not owner', async() => {
        mockedUserRepository.findById.mockResolvedValue({
            _id: '123',
            role: 'user'
        } as UserLean)

        mockedBlogRepository.findBySlug.mockResolvedValue({
            _id: '1234',
            status: 'draft'
        } as BlogLean)

        await expect(blogService.getBlogBySlug('123', '1234')).rejects.toThrow(new InsufficientPermissionsError())
    })

    it('should throw an Error when Slug is nto found', async() => {
        mockedUserRepository.findById.mockResolvedValue({
            _id: '123',
            role: 'user'
        } as UserLean)

        mockedBlogRepository.findBySlug.mockResolvedValue(null)

        await expect(blogService.getBlogBySlug('123', '1234')).rejects.toThrow(BlogNotFound)
    })

    it('should get any Blogs when is admin', async() => {
        mockedUserRepository.findById.mockResolvedValue({
            _id: '123',
            role: 'admin'
        } as UserLean)

        mockedBlogRepository.findBySlug.mockResolvedValue({
            _id: '1234',
            author: '9999',
        } as BlogLean)

        const result = await blogService.getBlogBySlug('123', '1234')

        expect(result).toEqual({
            _id: '1234',
            author: '9999',
        })
    })
})