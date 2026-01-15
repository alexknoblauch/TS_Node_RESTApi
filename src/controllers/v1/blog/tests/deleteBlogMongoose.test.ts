/*

import Blog from '@/models/blog';
import deleteBlog from '../deleteBlog';
import { userRepository } from '@/repository/userRepository/userRepository';

jest.mock('./models/Blog'); // das ganze Model wird gemockt

describe('deleteBlog', () => {
  it('should delete a blog', async () => {
    // mock deleteOne
    (Blog.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

    // Act
    const result = await deleteBlog('user123', 'blog123');

    // Assert
    expect(result).toBe(true);
    expect(Blog.deleteOne).toHaveBeenCalledWith({ _id: 'blog123', author: 'user123' });
  });
});
