/**
 * Custom Modules
 */
import logger from "@/lib/winston";
import bcrypt from 'bcrypt'
/**
 * Models
 */
import User from "@/models/user";
/**
 * Types
 */
import { userRepository } from "@/repository/userRepository/userRepository";
import AppError from "@/utils/AppError";
import { ensureDocument } from "@/utils/ensureDocument";

type  IUpdatedData = Partial<{
        username: string, password: string, email: string, firstName: string,lastName: string, website: string, youtube: string, facebook: string, instagram: string, linkedin: string, x: string
}>

const updateCurrentUser = (async (userId: string, updatedData: IUpdatedData): Promise<void> => {
    const user = await User.findById(userId)
    ensureDocument(user, 'User')
    
    //ACHTUNG: nie updatedData direkt in DB. das ist Client Logik - mutieren zu Server Logik
    const update: any = {}

    if (updatedData.username) update.username = updatedData.username
    if (updatedData.email) update.email = updatedData.email
    if (updatedData.password) {
        update.password = await bcrypt.hash(updatedData.password, 12)
    }
    if (updatedData.firstName) update.firstName = updatedData.firstName
    if (updatedData.lastName) update.lastName = updatedData.lastName

    const socialLinks: any = {}
    if (updatedData.website) socialLinks.website = updatedData.website
    if (updatedData.facebook) socialLinks.facebook = updatedData.facebook
    if (updatedData.instagram) socialLinks.instagram = updatedData.instagram
    if (updatedData.linkedin) socialLinks.linkedin = updatedData.linkedin
    if (updatedData.x) socialLinks.x = updatedData.x
    if (updatedData.youtube) socialLinks.youtube = updatedData.youtube

    if (Object.keys(socialLinks).length > 0) {
    update.socialLinks = socialLinks
    }

    await userRepository.updateById(userId, update)
    logger.info('User successfully updated')
})

export default updateCurrentUser