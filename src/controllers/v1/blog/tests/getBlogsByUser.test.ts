jest.mock('@/repository/blogRepository')
jest.mock('@/repository/userRepository')

import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { userRepository } from "@/repository/userRepository/userRepository"
import getBlogsByUser from "../getBlogsByUser"
import { IUser } from "@/models/user"


const MockedUserRepository = userRepository as jest.Mocked<typeof userRepository>
const MockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>;


describe('find blogs by user', () => {
    it('should find blog by userid', async() => {
        MockedUserRepository.findById.mockResolvedValue({
                _id: '123',
                role: 'user'
        } as IUser)

        const blogs = [
            {
                _id: '123',
                author: 'alex123',                    // | string hinzufügen für clean architecture
                status: 'published' 
            }
        ]

        const blogRepositoryMock = blogRepository as jest.Mocked<typeof blogRepository>;


        (blogRepositoryMock.findById as jest.Mock).mockResolvedValue(blogs)

        const result = await getBlogsByUser('123', {}, '123', 0, 10)

        expect(blogRepositoryMock.findById).toHaveBeenCalled()

        expect(result).toEqual(blogs)
    }),

    
    it('should throw error when user not found', async() => {
        (userRepository.findById as jest.Mock).mockResolvedValue(null)

        await expect(getBlogsByUser('123', {}, '123', 0, 10)).rejects.toThrow('User not found')
    }),

    it('should throw an error when DB not available', async() => {
        (MockedUserRepository.findById as jest.Mock).mockRejectedValue(new Error('DB not found'))

        await expect(getBlogsByUser('123', {}, '123', 0, 10)).rejects.toThrow('DB not found')
    })

    
    it('should throw an Error when Blog not found', async() => {
        MockedUserRepository.findById.mockResolvedValue({
                _id: '123',
                role: 'user'
        } as IUser)

        MockedBlogRepository.findById.mockResolvedValue(null)

        await expect(getBlogsByUser('123', {}, '123', 0, 10)).rejects.toThrow('Blog not found')
    })


    it('should thorw an error when DB is down', async() => {
        MockedBlogRepository.findById.mockRejectedValue(new Error('DB error'))

        await expect(getBlogsByUser('123', {}, '123', 0, 10)).rejects.toThrow('DB error')
    })
})