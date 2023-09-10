import { NextFunction } from "express"
import { tokensRepository } from "../repositories/tokens-db-repository"
import { DeviceViewModel } from "../types/token-types"
import { jwtService } from "../application/jwt-service"


export class SecurityDeviceService {
     

    async getDeviceByToken (token: string, IP:string): Promise<DeviceViewModel[] | null> {
        const userId = await jwtService.getUserIdByRefreshToken(token)
        const results = await tokensRepository.getTokenAndDevice(userId)
        if (results=== null) {return null}

        const resultDeviceIdOutput =  results.map((b) => {
            return {
                ip: b.IP,
                title: b.deviceName,
                lastActiveDate: b.issuedAt,
                deviceId: b.deviceId
            }
          })

        return resultDeviceIdOutput

    }

    async deleteDeviceId(deviceId: string): Promise<boolean | null> {
        const result = await tokensRepository.deleteDeviceId(deviceId)
        return result     
    }

    async deleteDeviceByUserId (refreshToken:string, deviceId:string): Promise<number> {

        const resultDeviceId = await tokensRepository.findOneDeviceId(deviceId)
        if(!resultDeviceId) {return 404}
        const resultUserId = await jwtService.getUserIdByToken(refreshToken)
        if(resultDeviceId.userId.toString() !== resultUserId!.toString()) {return 403}
        else {const result = await tokensRepository.deleteDeviceId(deviceId)
        return 204}
    }

    async deleteAllDevicesExceptOne (refreshToken: string): Promise<Boolean | null> {
        const deviceId = await jwtService.getDeviceIdByRefreshToken(refreshToken)
        const userId = await jwtService.getUserIdByRefreshToken(refreshToken)

        const res = await tokensRepository.deleteAllDevicesExceptOne(deviceId, userId)
        return res
    }
}

