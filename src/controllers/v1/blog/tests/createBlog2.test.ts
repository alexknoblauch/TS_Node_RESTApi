import { CreateBlog, IBlog } from "@/models/blog"
import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import blogService from "@/services/blog.service"

jest.mock('@/repository/blogRepository')


const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>


describe('createBlog', () => {
    it('should create a Blog ', async() => {
        mockedBlogRepository.create.mockResolvedValue({
            _id: '123' as any, 
            author: '1234',
            title: 'hallo',
            content: 'hallo',
            banner: {
                publicId: '12345',
                url: 'hallo',
                width: 1,
                height: 1 
            }
        } as IBlog);


        const result = await blogService.createBlog({
            author: '1234',
            title: 'hallo',
            content: 'hallo',
            banner: {
                publicId: '12345',
                url: 'hallo',
                width: 1,
                height: 1 
            }
        });

        expect(result).toEqual({
            _id: '123', 
            author: '1234',
            title: 'hallo',
            content: 'hallo',
            banner: {
                publicId: '12345',
                url: 'hallo',
                width: 1,
                height: 1 
            }
        });

        expect(mockedBlogRepository.create).toHaveBeenCalledWith({
            author: '1234',
            title: 'hallo',
            content: 'hallo',
            banner: {
                publicId: '12345',
                url: 'hallo',
                width: 1,
                height: 1 
            }
        });
    });


    it('should thrown an error when DB not available', async() => {
        mockedBlogRepository.create.mockRejectedValue(new Error('DB not found'));

        await expect(blogService.createBlog({
            author: '1234',
            title: 'hallo',
            content: 'hallo',
            banner: {
                publicId: '12345',
                url: 'hallo',
                width: 1,
                height: 1 
            }
            })).rejects.toThrow('DB not found');

            expect(blogRepository.create).toHaveBeenCalledWith({
                author: '1234',
                title: 'hallo',
                content: 'hallo',
                banner: {
                    publicId: '12345',
                    url: 'hallo',
                    width: 1,
                    height: 1 
                }
            });
        });


        it('should throw an error when invalid data', async() => {
            mockedBlogRepository.create.mockResolvedValue(null as any) 

            await expect(blogService.createBlog({
                author: '1234',
                title: 'hallo',
                content: 'hallo',
                banner: {
                    publicId: '12345',
                    url: 'hallo',
                    width: 1,
                    height: 1 
                }
            })).rejects.toThrow('No Blog Created')

            expect(mockedBlogRepository.create).toHaveBeenCalledWith({
                author: '1234',
                title: 'hallo',
                content: 'hallo',
                banner: {
                    publicId: '12345',
                    url: 'hallo',
                    width: 1,
                    height: 1 
                }
            })
        })
})