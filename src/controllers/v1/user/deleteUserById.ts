/**
 * Modules
 */

import User from "@/models/user";
import Blog from "@/models/blog";

/**
 * Custom Modules
 */

import logger from "@/lib/winston";
import { ensureDocument } from "@/utils/validation/ensureDocument";



const deleteUserById = (async function (userId: string):Promise<void> {
    const user = await User.findById(userId)
    ensureDocument(user, 'User')
    
    const blogs = await Blog.find({author: userId}).select('banner.publicId').lean().exec()
    
    // await cloudenary.delete(banner)                  //img löschen
    
    await User.deleteOne({ _id: userId })
    await Blog.deleteMany({author: userId})
    logger.info('Blogs of User delted', {
        userId,
        blogs
    })
})

export default deleteUserById