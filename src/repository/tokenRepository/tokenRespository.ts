import Token, { IToken, ITokenPersistence } from "@/models/token"

const tokenRepository =   {
    create: async (token: string, userId: string):Promise<IToken> => {
        return await Token.create({token, userId})
    },

    findOne: async (refreshToken: string):Promise<ITokenPersistence | null> => {
        return await Token.findOne({refreshToken: refreshToken})
    },

    findOneWithToken: async (refreshToken: string): Promise<ITokenPersistence | null> => {
        return await Token.findOne({ token: refreshToken }).select('+token');
    },

    delete: async (refreshToken: string):Promise<boolean> => {
        const result = await Token.deleteOne({token: refreshToken}) 
        return result.deletedCount > 0
    }
}

export default tokenRepository