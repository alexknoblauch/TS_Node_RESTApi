
import { BlogLean } from "@/models/blog"
import { UserLean } from "@/models/user"
import blogService from "@/services/blog.service"

import { userRepository } from '@/repository/userRepository/userRepository'
import { blogRepository } from '@/repository/blogRepository/blogreposiroty'
jest.mock('@/repository/userRepository')
jest.mock('@/repository/blogRepository')

const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>
const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>

describe('deleteBlog', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should delete a Blog', async() => {
        mockedBlogRepository.findById.mockResolvedValue({
            _id: '123',
            author: '1234'
        } as BlogLean)

        mockedUserRepository.findById.mockResolvedValue({
            _id: '1234',
            role: 'user'
        } as UserLean)

        mockedBlogRepository.deleteById.mockResolvedValue(true)

        const result = await blogService.deleteBlog('123', '1234')

        expect(mockedBlogRepository.deleteById).toHaveBeenCalledWith('123')

        expect(result).toBe(true)
    })

    it('should throw an Error when Blog is not of User', async() => {
         mockedBlogRepository.findById.mockResolvedValue({
            _id: '123',
            author: '123'
        } as BlogLean)

        mockedUserRepository.findById.mockResolvedValue({
            _id: '1234',
            role: 'user'
        } as UserLean)

        await expect(blogService.deleteBlog('123', '1234')).rejects.toThrow('Insufficient permissions')
    })

    it('should delete any Blog when is admin', async() => {
         mockedBlogRepository.findById.mockResolvedValue({
            _id: '123',
            author: '123'
        } as BlogLean)

        mockedUserRepository.findById.mockResolvedValue({
            _id: '1234',
            role: 'admin'
        } as UserLean)

        mockedBlogRepository.deleteById.mockResolvedValue(true)

        const result = await blogService.deleteBlog('123', '1234')

        expect(result).toBe(true)
    })

    it('should throw an error when invalid credentials', async() => {
        mockedBlogRepository.findById.mockResolvedValue({
            _id: '123',
            author: '1234'
        } as BlogLean)

        mockedUserRepository.findById.mockResolvedValue({
            _id: '1234',
            role: 'user'
        } as UserLean)

        mockedBlogRepository.deleteById.mockResolvedValue(false)

        await expect(blogService.deleteBlog('123', '1234')).rejects.toThrow('Invalid credentials')
    })

    it('should trow an error when DB is down', async() => {
        mockedUserRepository.findById.mockRejectedValue(new Error('DB not found'))

        await expect(blogService.deleteBlog('123', '1234')).rejects.toThrow('DB not found')
        
        expect(mockedBlogRepository.findById).not.toHaveBeenCalled()
        expect(mockedBlogRepository.deleteById).not.toHaveBeenCalled()
    }) 
})