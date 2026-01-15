jest.mock('@/repository/blogRepository')

import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import getAllBlogs from "../getAllBlogs"

describe('getAllBlogs', () => {
    it('happy path', async() => {

        const mockBlogs = [
            { _id: '1', title: 'Blog1', content: 'abc', author: '123', slug: 'blog1', banner: { publicId: '1', url: 'url', width: 1, height: 1 }, viewsCount:0, likesCount:0, commentsCount:0, status:'draft' },
            { _id: '2', title: 'Blog2', content: 'def', author: '456', slug: 'blog2', banner: { publicId: '2', url: 'url', width: 1, height: 1 }, viewsCount:0, likesCount:0, commentsCount:0, status:'draft' },
        ];

        (blogRepository.find as jest.Mock).mockResolvedValue(mockBlogs)

        const result = await getAllBlogs({}, 10, 0)

        expect(blogRepository.find).toHaveBeenCalledWith({}, { limit: 10, skip: 0 });
        expect(result).toEqual(mockBlogs);
    }),

    
    it('should throw error when user not found', async() => {
        (blogRepository.find as jest.Mock).mockResolvedValue(null)

        await expect(getAllBlogs({}, 10, 0)).rejects.toThrow('User not found')
    }),

    it('should throw an Error when DB not available', async() => {
        (blogRepository.find as jest.Mock).mockRejectedValue(new Error('DB Error'))
        
        await expect(getAllBlogs({}, 10, 0)).rejects.toThrow('DB Error')
    })
})