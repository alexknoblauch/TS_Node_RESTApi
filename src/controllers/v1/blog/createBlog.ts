/**
 * Node Modules
 */

import xss from 'xss'
/**
 * Custom Modules
*/
import catchAsync from "@/utils/catchAsync"
import logger from '@/lib/winston'
import { ensureDocument } from '@/utils/ensureDocument'
/**
 * Models
 */
import Blog, { IBlog } from '@/models/blog'
/**
 * Middleware
*/
/**
 * Types
 */
import { BannerType } from '@/models/blog'

const createBlog = (async function(title: string, cleanContent: string, banner: BannerType, status: string, userId: string): Promise<IBlog>{

    const newEntry = await Blog.create({ title, content: cleanContent, banner, status, author: userId })

    ensureDocument(newEntry, 'New Blog')

    return newEntry
})

export default createBlog