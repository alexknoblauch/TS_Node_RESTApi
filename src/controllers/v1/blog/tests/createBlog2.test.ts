import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import blogService from "@/services/blog.service"

jest.mock('@/repository/blogRepository/blogeposiroty')

const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>

describe('createBlog', () => {
    it('should create a blog', async function() {
        mockedBlogRepository.create.mockResolvedValue({
            _id: '123',
            title: 'string',
            slug: 'string',
            content: 'string',
            banner: {
                publicId: 'string', 
                url: 'string', 
                width: 1,
                height: 1
            },
            author: '1234', 
            status: 'draft'
        })

        const data = {
            title: 'string',
            slug: 'string',
            content: 'string',
            banner: {
                publicId: 'string', 
                url: 'string', 
                width: 1,
                height: 1
            },
            author: '1234', 
            status: 'draft'
        }

        const result = await blogService.createBlog(data)

        expect(blogRepository.create).toHaveBeenCalledWith(data)

        expect(result).toEqual({
            _id: '123',
            title: 'string',
            slug: 'string',
            content: 'string',
            banner: {
                publicId: 'string', 
                url: 'string', 
                width: 1,
                height: 1
            },
            author: '1234', 
            status: 'draft'
        })
    })

    describe('throw error when false input', async() => {
        (mockedBlogRepository.create as jest.Mock).mockResolvedValue(null)

        mockedBlogRepository.create.mockResolvedValue({
            _id: '123',
            title: 'string',
            slug: 'string',
            content: 'string',
            banner: {
                publicId: 'string', 
                url: 'string', 
                width: 1,
                height: 1
            },
            author: '1234', 
            status: 'draft'
        })

        const data = {
            title: 'string',
            slug: 'string',
            content: 'string',
            banner: {
                publicId: 'string', 
                url: 'string', 
                width: 1,
                height: 1
            },
            author: '1234', 
            status: 'draft'
        }

        expect(blogService.createBlog(data)).rejects.toThrow('DB error')
    })
})