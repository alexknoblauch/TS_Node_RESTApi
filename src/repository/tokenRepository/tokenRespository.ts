import Token, { IToken } from "@/models/token"

const tokenRepository =   {
    create: async (token: string, userId: string):Promise<IToken> => {
        return await Token.create({token, userId})
    },

    findOne: async (refreshToken: string):Promise<Partial<IToken | null>> => {
        return await Token.findOne({refreshToken: refreshToken})
    },

    delete: async (refreshToken: string):Promise<boolean> => {
        const result = await Token.deleteOne({token: refreshToken}) 
        return result.deletedCount > 0
    }
}

export default tokenRepository