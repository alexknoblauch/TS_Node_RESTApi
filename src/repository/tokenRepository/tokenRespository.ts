import Token, { IToken } from "@/models/token"

const tokenRepository =   {
    create: async (token: string, userId: string):Promise<IToken> => {
        return await Token.create({token, userId})
    },

    findOne: async (refreshToken: string):Promise<Partial<IToken | null>> => {
        return await Token.findOne({refreshToken: refreshToken})
    },

    delete: async (refreshToken: string):Promise<boolean> => {
        return await Token.deleteOne({token: refreshToken}) 
    }
}

export default tokenRepository