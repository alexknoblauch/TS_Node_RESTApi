import { blogRepository } from "@/repository/blogRepository/blogreposiroty"
import { userRepository } from "@/repository/userRepository/userRepository"

jest.mock('@repository/userRepository/userRepository')
jest.mock('@repository/userRepository/userRepository')

const mockedBlogRepository = blogRepository as jest.Mocked<typeof blogRepository>
const mockedUserRepository = userRepository as jest.Mocked<typeof userRepository>