import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import blogService from "@/services/blog.service"

jest.mock('@/repository/blogRepository')

const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>


describe('deleteBlog', () => {
    it('should delete a blog', async() => {
        mockedBlogRepository.deleteById.mockResolvedValue(true)

        const blogId = '123'
        const userId = '123'

        const result = await blogService.deleteBlog(blogId, userId);

        expect(result).toBe(true);

        expect(blogRepository.deleteById).toHaveBeenLastCalledWith(blogId, userId);
    });


    it('should throw a error when DB not available', async() => {
        mockedBlogRepository.deleteById.mockRejectedValue(new Error('DB not found'));

        await expect(blogService.deleteBlog('123', '123')).rejects.toThrow('DB not found');
    });


    it('should throw an error when invalid data', async() => {
        mockedBlogRepository.deleteById.mockResolvedValue(false);
        await expect(blogService.deleteBlog('123', '123')).rejects.toThrow('DB not found');
    });
})