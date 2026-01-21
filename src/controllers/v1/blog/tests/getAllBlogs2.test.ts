import { blogRepository } from "@/repository/blogRepository/blogreposiroty"

jest.mock('@/repository/blogRepository')

import { IBlog } from "@/models/blog"
import blogService from "@/services/blog.service"

const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>

describe('getAllBlogs', () => {
    it('should get all blogs', async() => {
        mockedBlogRepository.find.mockResolvedValueOnce([{
                _id: '123' as any,
                title: 'hallo',
                slug: 'hallo'
        } as IBlog]);

        const result = await blogService.getAllBlogs({_id: '123'}, {skip: 0, limit: 10});
        
        expect(result).toEqual([{
            _id: '123' as any,
            title: 'hallo',
            slug: 'hallo'
        }]);

        expect(mockedBlogRepository.find).toHaveBeenCalledWith({_id: '123'}, {skip: 0, limit: 10});
    });


    it('should throw an error when DB not available', async() => {
        mockedBlogRepository.find.mockRejectedValue(new Error('DB not found'));

        await expect(blogService.getAllBlogs({_id: '123'}, {skip: 0, limit: 10})).rejects.toThrow('DB not found');
    });


    it('should throw an error when no blogs found', async() => {
        mockedBlogRepository.find.mockResolvedValue([]);

        const result = await blogService.getAllBlogs({_id: '123'}, {skip: 0, limit: 10})

        expect(result).toEqual([])
        expect(mockedBlogRepository.find).toHaveBeenCalledWith({_id: '123'}, {skip: 0, limit: 10})
    })
})