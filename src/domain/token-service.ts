import {DevicesMongo} from '../types/token-types';
import {ObjectId} from 'mongodb';
import {jwtService} from '../application/jwt-service';
import {TokensRepository} from '../repositories/tokens-db-repository';


export class TokensService {
    constructor(protected tokensRepository: TokensRepository) {}
    async findTokenAndDevice(token: string): Promise<boolean | null> {
        const issuedAt = await jwtService.getIssueAttByRefreshToken(token)
        const resultIssuedAt = await this.tokensRepository.findTokenAndDeviceByIssuedAt(issuedAt)
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

        const addTokenUser = await this.tokensRepository.addRefreshToken(newDeviceAndRefreshToken)
        if (addTokenUser !== true) { return null }
        return refreshToken
    }

    async updateAccessToken(refreshToken: string): Promise<string | null> {
        const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
        if (userId === null) { return null }
        return await jwtService.createdJWTAccessToken(userId)
    }

    async updateDevicesModelClass(refreshToken: string, IP: string, deviceName: string): Promise<string | null> {
        const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
        if (userId === null) { return null }
        const deviceId = await jwtService.getDeviceIdByRefreshToken(refreshToken)
        if (deviceId === null) { return null }

        const issuedAt = await jwtService.getIssuedAttByRefreshToken(refreshToken)
        if (issuedAt === null) { return null }

        const resultDelete = await this.tokensRepository.deleteTokenAndDevice(issuedAt)
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

        const resultDelete = await this.tokensRepository.deleteTokenAndDevice(issuedAt)
        if (resultDelete === null) { return null }
        return true
    }

}
