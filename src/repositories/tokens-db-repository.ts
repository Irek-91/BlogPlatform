import { ObjectId } from "mongodb"
import { devicesMongo } from "../types/token-types"
import { jwtService } from "../application/jwt-service"
import { DevicesModelClass } from "../db/db-mongoos"



export const tokensRepository = {

    async addRefreshToken (newDeviceAndRefreshToken: devicesMongo): Promise<boolean | null> {
        try {const res = await DevicesModelClass.insertMany({...newDeviceAndRefreshToken})
        return true}
        catch (e) {return null}
    },

    


    async getUserIdByDeviceId(deviceId: string): Promise <ObjectId | null> {
        
        try {const res = await DevicesModelClass.findOne({deviceId: deviceId}).lean();
            if (res === null) {return null}
            return res.userId
        }
        catch (e) {return null}
    },

    async findTokenAndDeviceByissuedAt(issuedAt: string): Promise <true | null> {
        
        try {const res = await DevicesModelClass.findOne({issuedAt: issuedAt})
            if (res === null) {return null}
            return true
        }
        catch (e) {return null}
    },

    async deleteTokenAndDevice(issuedAt: string): Promise <true | null> {
        try {const res = await DevicesModelClass.deleteOne({issuedAt: issuedAt})
            if (res === null) {return null}
            return true
        }
        catch (e) {return null}
    },

    async deleteTokensAll () {
        const deletResult = await DevicesModelClass.deleteMany({})
        return true
    },

    async getTokenAndDevice(userId: ObjectId): Promise <devicesMongo[] | null> {
        
        try {const res = await DevicesModelClass.find({userId: userId}).lean();
            if (res === null) {return null}
            return res
        }
        catch (e) {return null}
    },

    async deleteDeviceId(deviceId: string): Promise<null | boolean > {
        try {const res = await DevicesModelClass.deleteOne({deviceId: deviceId});
            if (res === null) {return null}
            return res.acknowledged
        }
        catch (e) {return null}
    },

    async deleteAllDevicesExceptOne(deviceId: string, userId: ObjectId): Promise<Boolean | null> {
//добавить фильтр по userId

        try {
            const checkUserIdByDeviceId = await DevicesModelClass.find({userId: userId, deviceId: deviceId})
            if (checkUserIdByDeviceId.length === 0) {return null}
            const res = await DevicesModelClass.deleteMany({deviceId: {$ne:deviceId}});
            if (res === null) {return null}
            return res.acknowledged
        }
        catch (e) {return null}
    },

    async findOneDeviceId(deviceId: string) :Promise<devicesMongo | null>  {
        try {const res = await DevicesModelClass.findOne({deviceId: deviceId});
            if (res === null) {return null}
            return res
        }
        catch (e) {return null}
    }


}