import { BlogLean } from "@/models/blog"
import { UserLean } from "@/models/user"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { userRepository } from "@/repository/userRepository/userRepository"
import blogService from "@/services/blog.service"

jest.mock('@/repository/blogRepository/blogRepository')

const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>
const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>

describe('deleteBlog', () =>{
    it('should delete a blog', async() => {
        mockedBlogRepository.findById.mockResolvedValue({
            _id: '123',
            author: '1234'
        } as BlogLean)

        mockedUserRepository.findById.mockResolvedValue({
            _id: '12345',
        } as UserLean)

        mockedBlogRepository.deleteById.mockResolvedValue(true)

        const result = await blogService.deleteBlog('123', '12345')

        expect(result).toBe(true)



    })


})
