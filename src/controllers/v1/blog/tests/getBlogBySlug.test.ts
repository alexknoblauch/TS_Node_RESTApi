jest.mock('@/repository/blogrepository')

import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import getBlogBySlug from "../getBlogBySlug"
import { userRepository } from "@/repository/userRepository/userRepository"
import { IUser } from "@/models/user"

const mockedBlogRepository = (blogRepository as jest.Mocked<typeof blogRepository>)
const mockedUserRepository = (userRepository as jest.Mocked<typeof userRepository>)

describe('getBlogsBySlug', () => {
    it('finds Blog mit Slug', async() => {
        mockedBlogRepository.findBySlug.mockResolvedValue({
                _id: '123',
                slug: 'blog',
                author: 'alex123',                    // | string hinzufügen für clean architecture
                status: 'published' 
        });

        mockedUserRepository.findById.mockResolvedValue({
            _id: '123',
            role: 'user'
        } as IUser)

        const result = await getBlogBySlug('123', 'blog')

        expect(blogRepository.findBySlug).toHaveBeenCalledWith('123', 'blog')

        expect(result).toEqual({
                _id: '123',
                slug: 'blog',
                author: 'alex123',                    // | string hinzufügen für clean architecture
                status: 'published' 
        })
    }),

    
    it('should throw error when Blog not found', async() => {
        mockedUserRepository.findById.mockResolvedValue({
            _id: '123',
            userName: 'alex',
            email: 'alex@example.com',
            password: 'hashedpw',
            role: 'user'
        })

        mockedBlogRepository.findBySlug.mockResolvedValue(null)

        await expect(getBlogBySlug('123', 'blog')).rejects.toThrow('Blog not found')
    })


    it('should throw an Error when DB is not available', async() => {
        mockedUserRepository.findById.mockResolvedValue({
            _id: '123',
            userName: 'alex',
            email: 'alex@example.com',
            password: 'hashedpw',
            role: 'user'
        })

        mockedBlogRepository.findBySlug.mockRejectedValue(new Error('DB not found'))

        await expect(getBlogBySlug('123', 'blog')).rejects.toThrow('DB not found')
    })

    it('should throw an Error when User not found', async() => {
        mockedUserRepository.findById.mockResolvedValue(null)

        await expect(getBlogBySlug('123', 'blog')).rejects.toThrow('User not found')
    }) 
})