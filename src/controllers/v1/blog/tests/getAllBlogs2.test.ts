import { BlogDocument, BlogLean } from "@/models/blog"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import blogService from "@/services/blog.service"

jest.mock('@repository/blogRepository')


const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>

describe('getAllBlogs', () => {
    it('should get all Blogs', async() => {
        mockedBlogRepository.find.mockResolvedValue([
            {_id: '123',},{ _id: '321'}
        ] as BlogLean[])

        const result = await blogService.getAllBlogs({},{skip: 0, limit: 10})

        expect(blogRepository.find).toHaveBeenCalledWith({},{skip: 0, limit: 10})

        expect(result).toEqual([
            {_id: '123',},{ _id: '321'}
        ])
    })

    it('should throw an Error when no Blog is found', async() => {
        mockedBlogRepository.find.mockResolvedValue([])

        const result = await blogService.getAllBlogs({},{skip: 0, limit: 10})

        expect(blogRepository.find).toHaveBeenCalledWith({},{skip: 0, limit: 10})

        expect(result).toEqual([])

    })
})