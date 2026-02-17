import InsufficientPermissionsError from "@/errors/service/common/InsufficientPermissionsError"
import { BlogLean } from "@/models/blog"
import { UserLean } from "@/models/user"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { userRepository } from "@/repository/userRepository/userRepository"
import blogService from "@/services/blog.service"

jest.mock('@repository/userRepository/userRepository')
jest.mock('@repository/blogRepository/blogRepository')

const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>
const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>

describe('getAllBlogs', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    
    it('should retreive all Blogs of a user', async() => {
        mockedBlogRepository.find.mockResolvedValue([
            {_id: '123', author: '1234'},
            {_id: '321', author: '1234'}
        ])

        const result = await blogService.getAllBlogs({author: '1234'}, {limit:1, skip:1})

        expect(result).toEqual([
            {_id: '123', author: '1234'},
            {_id: '321', author: '1234'}
        ])
    })

    it('should throw an Error when DB not available', async() => {
        mockedBlogRepository.find.mockRejectedValue(new Error('DB not found'))

        await expect(blogService.getAllBlogs({author: '1234'}, {limit:1, skip:1})).rejects.toThrow('DB not found')
    })

    it('shuold find no Blogs when User not exists', async() => {
        mockedBlogRepository.find.mockResolvedValue([])

        const result = await blogService.getAllBlogs({author: '123'}, {limit:1, skip:1})

        expect(result).toEqual([])
    })
})