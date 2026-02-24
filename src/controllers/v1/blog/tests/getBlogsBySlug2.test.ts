import { BlogLean } from "@/models/blog"
import { UserLean } from "@/models/user"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { userRepository } from "@/repository/userRepository/userRepository"
import blogService from "@/services/blog.service"

jest.mock('@repository/userRepository')
jest.mock('@repository/blogRepository')

const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>
const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>


describe('getBlogBySlug', () => {
    it('should get a  Blog by slug', async() => {
    mockedUserRepository.findById.mockResolvedValue({
            _id: '123'
    } as UserLean)

    mockedBlogRepository.findBySlug.mockResolvedValue({
        _id: '1234',
        author: '123',
        slug: 'test'
    } as BlogLean)

    const result = await blogService.getBlogBySlug('123', 'test')

    expect(mockedBlogRepository.findBySlug).toHaveBeenCalledWith('test')

    expect(result).toEqual({
        _id: '1234',
        author: '123',
        slug: 'test'
    })
    })
})