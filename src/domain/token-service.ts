import { refreshToken } from './../types/token-types';
import { tokensRepository } from "../repositories/tokens-db-repository"
import { refreshTokenMongo } from "../types/token-types"
import { jwtService } from '../application/jwt-service';
import { ObjectId } from 'mongodb';


export const tokensService = {
    async findTokenAndDevice (token: string): Promise<boolean | null> {
        const issuedAt = await jwtService.getIssuedAttByRefreshToken(token)
        if (issuedAt === null) {return null}

        const resultIssuedAt = await tokensRepository.findTokenAndDevice(issuedAt)
        if (resultIssuedAt) {return true}
        else {return null}
    },

    async addDeviceIdRefreshToken (userId: ObjectId, deviceId: string, IP: string): Promise<null | string> {
        const issuedAt = new Date();
        const expirationDate = new Date (issuedAt.setSeconds(issuedAt.getSeconds() + 20))
        const refreshToken = await jwtService.createJWTRefreshToken(userId, deviceId)
        if (refreshToken === null) {return null}
        const newDeviceAndRefreshToken: refreshTokenMongo = {
                _id: new ObjectId(),
                issuedAt,
                expirationDate,
                deviceId,
                IP: IP,
                deviceName: "string",
                userId
            }
        const addTokenUser = await tokensRepository.addRefreshToken(newDeviceAndRefreshToken)
        if (addTokenUser !== true) {return null}
        return refreshToken
    },

    async updateAccessToken (refreshToken: string): Promise<string | null> {
        const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
        if (userId === null) {return null}
        const newAccessToken = await jwtService.createdJWTAccessToken(userId)
        return newAccessToken
    },




    async updateRefreshTokens (refreshToken: string, IP: string): Promise<string | null> {
        const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
        if (userId === null) {return null}
        const deviceId = await jwtService.getDeviceIdByRefreshToken(refreshToken)
        if (deviceId === null) {return null}
        
        const issuedAt = await jwtService.getIssuedAttByRefreshToken(refreshToken)
        if (issuedAt === null) {return null}

        const resultDelete = await tokensRepository.deleteTokenAndDevice(issuedAt)
        if (resultDelete === null) {return null}

        const result = await tokensService.addDeviceIdRefreshToken(userId, deviceId, IP)

        if (result) {
            return result
        }
        else {return null}
    },
    

    async deleteDeviceIdRefreshToken(refreshToken: string): Promise <true | null> {
        const issuedAt = await jwtService.getIssuedAttByRefreshToken(refreshToken)
        if (issuedAt === null) {return null}

        const resultDelete = await tokensRepository.deleteTokenAndDevice(issuedAt)
        if (resultDelete === null) {return null}
        return true
    } 
    
}
