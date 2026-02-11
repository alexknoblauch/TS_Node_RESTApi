
/**
 * Models
 */
import User from "@/models/user";
/**
 * Middleware
 */
import logger from "@/lib/winston";
/**
 * Types
 */
import { ensureDocument } from "@/utils/validation/ensureDocument";
import getOrSetRedis from "@/infra/cache/getOrSetRedis";


const getUser = (async function (userId:string) {
    const cacheKey = `User:${userId}`

    const data = await getOrSetRedis(cacheKey, async () => {
        const user = await User.findById(userId).select('-__v -password -refreshToken').lean().exec()
        ensureDocument(user, 'User')

        return user 
    })

    return data
})

export default getUser