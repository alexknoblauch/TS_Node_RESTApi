import Token, { IToken } from "@/models/token"

const tokenRepository =   {
    create: async(token: string, userId: string):Promise<IToken> => {
        return await Token.create({token, userId})
    },

    exists: async(refreshToken: string):Promise<Partial<IToken | null>> => {
        return await Token.findOne({refreshToken: refreshToken})
    }
}

export default tokenRepository