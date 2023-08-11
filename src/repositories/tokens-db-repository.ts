import { ObjectId } from "mongodb"
import { refreshTokenCollections } from "../db/db-mongo"
import { refreshTokenMongo } from "../types/token-types"



export const tokensRepository = {

    async findToken(token: string): Promise<refreshTokenMongo | null> {
        try {let result = await refreshTokenCollections.findOne({token: token})
            return result}
        catch (e) {return null}
    },
    async addRefreshToken (token: string): Promise<boolean | null> {
        try {const res = await refreshTokenCollections.insertOne({token, _id: new ObjectId()})
        return res.acknowledged}
        catch (e) {return null}

    },

    async deleteTokensAll () {
        const deletResult = await refreshTokenCollections.deleteMany({})
        return true
    }
}