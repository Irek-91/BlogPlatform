import { DevicesMongo, refreshToken } from './../types/token-types';
import { tokensRepository } from "../repositories/tokens-db-repository"
import { ObjectId } from 'mongodb';
import { jwtService } from '../application/jwt-service';


export class TokensService {

    async findTokenAndDevice(token: string): Promise<boolean | null> {
        const issuedAt = await jwtService.getIssueAttByRefreshToken(token)
        const resultIssuedAt = await tokensRepository.findTokenAndDeviceByissuedAt(issuedAt)
        if (resultIssuedAt) { return true }
        else { return null }
    }

    async addDeviceIdRefreshToken(userId: ObjectId, deviceId: string, IP: string, deviceName: string): Promise<null | string> {
        const refreshToken = await jwtService.createJWTRefreshToken(userId, deviceId)
        const issuedAt = await jwtService.getIssueAttByRefreshToken(refreshToken)
        const expirationDate = await jwtService.getExpiresAttByRefreshToken(refreshToken)
        const newDeviceAndRefreshToken = new DevicesMongo(new ObjectId(),
            issuedAt,
            expirationDate,
            deviceId,
            IP,
            deviceName,
            userId)

        const addTokenUser = await tokensRepository.addRefreshToken(newDeviceAndRefreshToken)
        if (addTokenUser !== true) { return null }
        return refreshToken
    }

    async updateAccessToken(refreshToken: string): Promise<string | null> {
        const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
        if (userId === null) { return null }
        const newAccessToken = await jwtService.createdJWTAccessToken(userId)
        return newAccessToken
    }

    async updateDevicesModelClass(refreshToken: string, IP: string, deviceName: string): Promise<string | null> {
        const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
        if (userId === null) { return null }
        const deviceId = await jwtService.getDeviceIdByRefreshToken(refreshToken)
        if (deviceId === null) { return null }

        const issuedAt = await jwtService.getIssuedAttByRefreshToken(refreshToken)
        if (issuedAt === null) { return null }

        const resultDelete = await tokensRepository.deleteTokenAndDevice(issuedAt)
        if (resultDelete === null) { return null }

        const result = await this.addDeviceIdRefreshToken(userId, deviceId, IP, deviceName)

        if (result) {
            return result
        }
        else { return null }
    }


    async deleteDeviceIdRefreshToken(refreshToken: string): Promise<true | null> {
        const issuedAt = await jwtService.getIssuedAttByRefreshToken(refreshToken)
        if (issuedAt === null) { return null }

        const resultDelete = await tokensRepository.deleteTokenAndDevice(issuedAt)
        if (resultDelete === null) { return null }
        return true
    }

}
