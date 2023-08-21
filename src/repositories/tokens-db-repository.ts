import { ObjectId } from "mongodb"
import { refreshTokenCollections } from "../db/db-mongo"
import { refreshTokenMongo } from "../types/token-types"



export const tokensRepository = {

    async addRefreshToken (newDeviceAndRefreshToken: refreshTokenMongo): Promise<boolean | null> {
        try {const res = await refreshTokenCollections.insertOne({...newDeviceAndRefreshToken})
        return res.acknowledged}
        catch (e) {return null}

    },

    async findTokenAndDeviceByissuedAt(issuedAt: string): Promise <true | null> {
        
        try {const res = await refreshTokenCollections.findOne({issuedAt: issuedAt})
            if (res === null) {return null}
            return true
        }
        catch (e) {return null}
    },

    async deleteTokenAndDevice(issuedAt: string): Promise <true | null> {
        try {const res = await refreshTokenCollections.deleteOne({issuedAt: issuedAt})
            if (res === null) {return null}
            return true
        }
        catch (e) {return null}
    },

    async deleteTokensAll () {
        const deletResult = await refreshTokenCollections.deleteMany({})
        return true
    },

    async getTokenAndDevice(userId: ObjectId): Promise <refreshTokenMongo[] | null> {
        
        try {const res = await refreshTokenCollections.find({userId: userId}).toArray();
            if (res === null) {return null}
            return res
        }
        catch (e) {return null}
    },

    async deleteDeviceId(deviceId: string): Promise<null | boolean > {
        try {const res = await refreshTokenCollections.deleteOne({deviceId: deviceId});
            if (res === null) {return null}
            return res.acknowledged
        }
        catch (e) {return null}
    },

    async deleteAllButOne(issuedAt: string): Promise<Boolean | null> {
        try {const res = await refreshTokenCollections.deleteMany({issuedAt: {$nin:[issuedAt]}});
            if (res === null) {return null}
            return res.acknowledged
        }
        catch (e) {return null}
    }


}