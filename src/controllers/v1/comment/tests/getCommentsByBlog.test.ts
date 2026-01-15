jest.mock('@/repository/commentRepository')
jest.mock('@/repository/blogRepository')

import { commentRepository } from "@/repository/commentRepository/commentRepository"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { IComment } from "@/models/comment"
import getCommentsByBlog from "../getCommentsByBlog"

const mockedCommentRepository = commentRepository as jest.Mocked<typeof commentRepository>
const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>



describe('getCommentByBlog', () => {
    it('should get all the blogs by slug', async() => {

        mockedBlogRepository.findById.mockResolvedValue({
            _id: '123',
            title: 'trest',
            slug: 'trest',
            content: 'test',
            banner: {
                publicId: '12345',
                url: 'string',
                width: 1,
                height: 1
            },
            author: 'alex',                    // | string hinzufügen für clean architecture
            viewsCount: 1,
            likesCount: 1,
            commentsCount: 1,
            status:'publicated'
        })


        mockedCommentRepository.find.mockResolvedValue([{
                _id: '1234',  
                blogId: '123',
                userId: '123',
                comment: 'test comment',
        }] as IComment[])


        const result = await getCommentsByBlog('123')

        expect(result).toEqual([{
                _id: '1234',  
                blogId: '123',
                userId: '123',
                comment: 'test comment',
        }])
    })
})
