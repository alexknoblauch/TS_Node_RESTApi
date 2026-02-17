import { BlogLean, CreateBlogDTO } from "@/models/blog"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { userRepository } from "@/repository/userRepository/userRepository"
import blogService from "@/services/blog.service"

jest.mock('@repository/blogRepository/blogRepository')
jest.mock('@repository/userRepository/userRepository')

const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>
const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>

describe('createBlog', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should create a Blog', async() => {
        mockedBlogRepository.create.mockResolvedValue({
            _id: '123',
            author: '1234'
        } as BlogLean)

        const data = {
            author: '1234'
        } as CreateBlogDTO

        const result = await blogService.createBlog(data)

        expect(result).toEqual({
            _id: '123',
            author: '1234'
        })
    })

    it('should throw an Error when DB not found', async() => {
        mockedBlogRepository.create.mockRejectedValue(new Error('DB not found'))

        const data = {
            author: '1234'
        } as CreateBlogDTO


        await expect(blogService.createBlog(data)).rejects.toThrow('DB not found')
    })

    it('should throw an Error when User not found', async() => {
        
    })
})