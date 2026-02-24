import HttpAppError from "@/errors/http/HTTPAppError"
import BlogBannerError from "@/errors/service/blog/BlogBannerError"
import BlogNoContent from "@/errors/service/blog/BlogNoContent"
import BlogNoTitle from "@/errors/service/blog/BlogNoTitle"
import { BlogLean } from "@/models/blog"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import blogService from "@/services/blog.service"

jest.mock('@/repository/blogRepository')

const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>


describe('createBlog', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should create a Blog', async () => {
        mockedBlogRepository.create.mockResolvedValue({
            _id: '123',
            title: 'test',
            content: 'test',
            author: '1234'
        } as BlogLean)

        const result = await blogService.createBlog({author: '1234', title: 'test', content: 'test'})

        expect(mockedBlogRepository.create).toHaveBeenCalledWith({
            author: '1234',
            title: 'test',
            content: 'test',
        })

        expect(result).toEqual({
            _id: '123',
            title: 'test',
            content: 'test',
            author: '1234'
        })
    })

    it('should throw an Error when DB down', async() => {
        mockedBlogRepository.create.mockRejectedValue( new Error('DB not found'))

        await expect(blogService.createBlog({author: '1234', title: 'test', content: 'test'})).rejects.toThrow('DB not found')
    })

    it('should throw en Error when validation wrong', async() => {

        await expect(blogService.createBlog({author: '1234', title: '', content: 'test'})).rejects.toThrow(BlogNoTitle)
    })

    it('should throw en Error when validation wrong', async() => {

        await expect(blogService.createBlog({author: '1234', title: 'test', content: ''})).rejects.toThrow(BlogNoContent)
    })

    it('should throw en Error when validation wrong', async() => {

        await expect(blogService.createBlog({author: '1234', title: 'test', content: 'test'})).rejects.toThrow(BlogBannerError)
    })

    it('should throw en Error when validation wrong', async() => {

        await expect(blogService.createBlog({author: '', title: 'test', content: 'test'})).rejects.toThrow('No Author found')
    })
})
