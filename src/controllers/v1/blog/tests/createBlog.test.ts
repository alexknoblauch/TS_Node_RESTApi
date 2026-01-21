jest.mock('@/repository/blogRepository')

import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import blogService from "@/services/blog.service"
import xss from "xss"

describe('function should creeate new User', () => {
    const mockXss = xss as jest.Mock;
                                                            // initialize XSS: mock und data content must be different
    beforeEach(() => {
        jest.clearAllMocks();
        mockXss.mockImplementation((input) => input); 
    });
    

    it('must create a new User', async() => {
        (blogRepository.create as jest.Mock).mockResolvedValue({
            _id: '123',                                     // _id von DB !
            author: '123',                      
            content: 'abc', 
            title: 'abc', 
            banner: {
                publicId: '123',
                url: '123',
                width: 1,
                height: 1
            },
            status: 'draft'
        })

        const data = {                             // keine _id !   
            author: '123',                     
            content: 'abc', 
            title: 'abc', 
            banner: {
                publicId: '123',
                url: '123', 
                width: 1,
                height: 1
            },
            status: 'draft'
        }

        const result = await blogService.createBlog(data)
            
        expect(blogRepository.create).toHaveBeenCalledWith(data)
        
        expect(result).toEqual({
            userId: '123', 
            cleanContent: 'abc', 
            title: 'abc', 
            banner: {
                publicId: '123',
                url: '123',
                width: 1,
                height: 1
            },
            status: 'draft'
        })
    });


    it('should throw an Error when creation failed', async() => {
        (blogRepository.create as jest.Mock).mockResolvedValue(null);

        const data = {                             // keine _id !   
            content: 'abc', 
            author: '123',                     
            title: 'abc', 
            banner: {
                publicId: '123',
                url: '123', 
                width: 1,
                height: 1
            },
            status: 'draft' as const            // dieser exakte Wert
        }

        await expect(blogService.createBlog(data)).rejects.toThrow('create new Blog not worked');
    });

    
    it('should throw an error when the DB is down', async() => {
        (blogRepository.create as jest.Mock).mockRejectedValue(new Error('DB error'))

        const data = {                             // keine _id !   
            content: 'abc', 
            author: '123',                     
            title: 'abc', 
            banner: {
                publicId: '123',
                url: '123', 
                width: 1,
                height: 1
            },
            status: 'draft' as const            // dieser exakte Wert
        }

        await expect(blogService.createBlog(data)).rejects.toThrow('DB error')
    })

})