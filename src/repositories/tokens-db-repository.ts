import { ObjectId } from "mongodb"
import { deviceTokenCollections } from "../db/db-mongo"
import { refreshTokenMongo } from "../types/token-types"
import { jwtService } from "../application/jwt-service"



export const tokensRepository = {

    async addRefreshToken (newDeviceAndRefreshToken: refreshTokenMongo): Promise<boolean | null> {
        try {const res = await deviceTokenCollections.insertOne({...newDeviceAndRefreshToken})
        return res.acknowledged}
        catch (e) {return null}

    },

    


    async getUserIdByDeviceId(deviceId: string): Promise <ObjectId | null> {
        
        try {const res = await deviceTokenCollections.findOne({deviceId: deviceId});
            if (res === null) {return null}
            return res.userId
        }
        catch (e) {return null}
    },

    async findTokenAndDeviceByissuedAt(issuedAt: string): Promise <true | null> {
        
        try {const res = await deviceTokenCollections.findOne({issuedAt: issuedAt})
            if (res === null) {return null}
            return true
        }
        catch (e) {return null}
    },

    async deleteTokenAndDevice(issuedAt: string): Promise <true | null> {
        try {const res = await deviceTokenCollections.deleteOne({issuedAt: issuedAt})
            if (res === null) {return null}
            return true
        }
        catch (e) {return null}
    },

    async deleteTokensAll () {
        const deletResult = await deviceTokenCollections.deleteMany({})
        return true
    },

    async getTokenAndDevice(userId: ObjectId): Promise <refreshTokenMongo[] | null> {
        
        try {const res = await deviceTokenCollections.find({userId: userId}).toArray();
            if (res === null) {return null}
            return res
        }
        catch (e) {return null}
    },

    async deleteDeviceId(deviceId: string): Promise<null | boolean > {
        try {const res = await deviceTokenCollections.deleteOne({deviceId: deviceId});
            if (res === null) {return null}
            return res.acknowledged
        }
        catch (e) {return null}
    },

    async deleteAllDevicesExceptOne(deviceId: string, userId: ObjectId): Promise<Boolean | null> {
//добавить фильтр по userId

        try {
            const checkUserIdByDeviceId = await deviceTokenCollections.find({userId: userId, deviceId: deviceId}).toArray()
            if (checkUserIdByDeviceId.length === 0) {return null}
            const res = await deviceTokenCollections.deleteMany({deviceId: {$ne:deviceId}});
            if (res === null) {return null}
            return res.acknowledged
        }
        catch (e) {return null}
    },

    async findOneDeviceId(deviceId: string) :Promise<refreshTokenMongo | null>  {
        try {const res = await deviceTokenCollections.findOne({deviceId: deviceId});
            if (res === null) {return null}
            return res
        }
        catch (e) {return null}
    }


}