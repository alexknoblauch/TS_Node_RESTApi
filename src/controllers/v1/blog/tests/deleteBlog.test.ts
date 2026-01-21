jest.mock('@/repository/userRepository')
jest.mock('@/repository/blogRepository')

import { userRepository } from '@/repository/userRepository/userRepository'
import { blogRepository } from '@/repository/blogRepository/blogreposiroty'
import deleteBlog from '../deleteBlog'
import blogService from '@/services/blog.service'

describe('deleteBlog', () => {
  it('löscht Blog, wenn User der Autor ist', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue({
      _id: 'user123',
      role: 'user'
    })

    (blogRepository.findById as jest.Mock).mockResolvedValue({
      _id: 'blog123',
      author: 'user123'
    })
    

    (blogRepository.deleteById as jest.Mock).mockResolvedValue(true)

    const result = await blogService.deleteBlog('user123', 'blog123')

    // REPO calls Assert
    expect(userRepository.findById).toHaveBeenCalledWith('user123')
    expect(blogRepository.findById).toHaveBeenCalledWith('blog123')
    expect(blogRepository.deleteById).toHaveBeenCalledWith('blog123')
    
    expect(result).toBe(true)
  }),

  
  it('should throw error when user not found', async() => {
      (userRepository.findById as jest.Mock).mockResolvedValue(null)

      await expect(blogService.deleteBlog('user123', 'blog123')).rejects.toThrow('User not found')
    }),
    

  it('should throw an error when the DB is down', async() => {
      //Pfad bis zur DB
      (userRepository.findById as jest.Mock).mockResolvedValue({
        _id: 'user123',
        role: 'user'
      })

      (blogRepository.findById as jest.Mock).mockResolvedValue({
        _id: 'blog123',
        author: 'user123'
      })


      //DB + Error Case
      (blogRepository.deleteById as jest.Mock).mockRejectedValue(new Error('DB error'))

      await expect(blogService.deleteBlog('user123', 'blog123')).rejects.toThrow('DB error')
    })
  })




