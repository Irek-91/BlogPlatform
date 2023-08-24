import { ObjectId } from "mongodb"
import { refreshTokenCollections } from "../db/db-mongo"
import { refreshTokenMongo } from "../types/token-types"
import { jwtService } from "../application/jwt-service"



export const tokensRepository = {

    async addRefreshToken (newDeviceAndRefreshToken: refreshTokenMongo): Promise<boolean | null> {
        try {const res = await refreshTokenCollections.insertOne({...newDeviceAndRefreshToken})
        return res.acknowledged}
        catch (e) {return null}

    },

    


    async getUserByDeviceId(deviceId: string): Promise <ObjectId | null> {
        
        try {const res = await refreshTokenCollections.findOne({deviceId: deviceId});
            if (res === null) {return null}
            return res.userId
        }
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

    async deleteAllButOne(deviceId: string, userId: ObjectId): Promise<Boolean | null> {
//добавить фильтр по userId

        try {
            const checkUserIdByDeviceId = await refreshTokenCollections.find({userId: userId, deviceId: deviceId}).toArray()
            if (checkUserIdByDeviceId.length === 0) {return null}
            const res = await refreshTokenCollections.deleteMany({deviceId: {$ne:deviceId}});
            if (res === null) {return null}
            return res.acknowledged
        }
        catch (e) {return null}
    }


}