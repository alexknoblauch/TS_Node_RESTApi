import UserNotFound from "@/errors/service/user/UserNotFound"
import { BlogLean } from "@/models/blog"
import { UserLean } from "@/models/user"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { userRepository } from "@/repository/userRepository/userRepository"
import blogService from "@/services/blog.service"

jest.mock('@repository/userRepository/userRepository')
jest.mock('@repository/blogRepository/blogRepository')

const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>
const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>

describe('getBlogsByUser', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    
    it('should get all Blogs of a User', async() => {
        mockedUserRepository.findById.mockResolvedValue({
            _id: '123',
            role: 'user'
        } as UserLean)

        mockedBlogRepository.find.mockResolvedValue([{
            _id: '1234',
            author: '123'
        } as BlogLean])

        const restult = await blogService.getBlogsByUser('123', {}, {queryId: '1', limit: 1, skip: 1})

        expect(restult).toEqual([{
            _id: '1234',
            author: '123'
        }])
    })

    it('should throw an Error when DB is not available', async() => {
        mockedUserRepository.findById.mockRejectedValue(new Error('DB not found'))

        await expect(blogService.getBlogsByUser('123', {}, {queryId: '1', limit: 1, skip: 1})).rejects.toThrow('DB not found')
    })

    it('should throw an Error when User not found', async() => {
        mockedUserRepository.findById.mockResolvedValue(null)

        await expect(blogService.getBlogsByUser('123', {}, {queryId: '1', limit: 1, skip: 1})).rejects.toThrow(UserNotFound)
    })
})