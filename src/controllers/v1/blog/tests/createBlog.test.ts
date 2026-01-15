jest.mock('@/repository/blogRepository')

import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import createBlog from "../createBlog"
import { Result } from "express-validator"

describe('function should creeate new User', () => {
    it('must create a new User', async() => {
        
        (blogRepository.create as jest.Mock).mockResolvedValue({
            _id: '123', 
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

        const result = await createBlog( '123', 'abc', 'abc', {
                publicId: '123',
                url: '123',
                width: 1,
                height: 1
            }, 'draft')
            
        expect(blogRepository.create).toHaveBeenCalledWith({
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

        await expect(createBlog('123', 'abc', 'abc', { publicId: '123', url: '123', width: 1, height: 1 },
            'draft')).rejects.toThrow('create new Blog not worked');
    });

    
    it('should throw an error when the DB is down', async() => {
        (blogRepository.create as jest.Mock).mockRejectedValue(new Error('DB error'))

        await expect(createBlog(
            '123',
            'abc',
            'abc',
            { publicId: '123', url: '123', width: 1, height: 1 },
            'draft')
        ).rejects.toThrow('DB error')
    })

})