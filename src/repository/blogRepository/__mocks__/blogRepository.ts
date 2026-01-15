export const blogRepository = function() {
    find: jest.fn()
    findById: jest.fn()
    findBySlug: jest.fn()
    create: jest.fn()
    update: jest.fn()
    deleteById: jest.fn()
}