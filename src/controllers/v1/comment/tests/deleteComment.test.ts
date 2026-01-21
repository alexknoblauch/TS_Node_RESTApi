jest.mock('@/repository/commentRepository')
jest.mock('@/repository/userRepository')

import { userRepository } from "@/repository/userRepository/userRepository"
import { commentRepository } from "@/repository/commentRepository/commentRepository"
import { IUser } from "@/models/user"
import deleteComment from "../deleteComment"

const mockedUserRepository = (userRepository as jest.Mocked<typeof userRepository>)
const mockedCommentRepository = (commentRepository as jest.Mocked<typeof commentRepository>)

deleteComment

describe('deleteComment', () => {
    it('should delete a Comment', async() => {
        mockedUserRepository.findById.mockResolvedValue({
            _id: '123', 
            userName: 'test', 
            email: 'test@test.com',
            password: 'hashed',
            role: 'user',
        })

        mockedCommentRepository.find.mockResolvedValue([{
            _id: '1234',                                       //userID wird created muss ich hier schreiben
            userId: '123',
            blogId: 'blog123',
            comment: 'jfekfjekkfkejfe'
        }]);

        
        mockedCommentRepository.deleteById.mockResolvedValue(true)
        expect(mockedCommentRepository.deleteById).toHaveBeenCalledWith('1234')     // bei delete update und create

        const result = await deleteComment('123', '1234')

        expect(result).toEqual(true)
    })



})