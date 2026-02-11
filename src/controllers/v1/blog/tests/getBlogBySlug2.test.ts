import { BlogLean } from "@/models/blog"
import { UserLean } from "@/models/user"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { userRepository } from "@/repository/userRepository/userRepository"
import blogService from "@/services/blog.service"

jest.mock('@/repository/userRepository/userRepositry')
jest.mock('@/repository/blogRepository/blogRepositry')

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

        const result = await blogService.getBlogBySlug('slug-slug')

        expect(result).toEqual({
            _id: '123',
            author: '1234',
            slug: 'slug-slug'
        })
    })
})