import { jwtService } from "../application/jwt-service"
import { tokensRepository } from "../repositories/tokens-db-repository"
import { DeviceViewModel } from "../types/token-types"


export const securityDeviceService = {
    async getDeviceByToken (token: string, IP:string): Promise<DeviceViewModel[] | null> {
        const userId = await jwtService.getUserIdByRefreshToken(token)
        if (userId=== null) {return null}
        const results = await tokensRepository.getTokenAndDevice(userId)
        if (results=== null) {return null}

        const resultDeviceIdOutput =  results.map((b) => {
            return {
                ip: b.IP,
                title: 'string',
                lastActiveDate: b.issuedAt,
                deviceId: b.deviceId
            }
          })

        return resultDeviceIdOutput

    },

    async deleteDeviceId(deviceId: string): Promise<boolean | null> {
        const result = await tokensRepository.deleteDeviceId(deviceId)
        return result     
    },

    async getDeviceByUserId (refreshToken:string, deviceId:string): Promise<boolean | null> {
        const resultDeviceId = await jwtService.getDeviceIdByRefreshToken(refreshToken)
        if (resultDeviceId === null) {return null}
        if (resultDeviceId !== deviceId) {return false}
        return true
    },

    async deleteAllButOne (refreshToken: string): Promise<Boolean | null> {
        const issuedAt = await jwtService.getIssuedAttByRefreshToken(refreshToken)
        if (issuedAt === null) return null
        const res = await tokensRepository.deleteAllButOne(issuedAt)
        return res
    }


    /*async getDeviceByToken (token: string, IP:string): Promise<DeviceViewModel | null> {
        const issuedAt = await jwtService.getIssuedAttByRefreshToken(token)
        if (issuedAt=== null) {return null}
        const result = await tokensRepository.getTokenAndDevice(issuedAt)
        if (result=== null) {return null}

        const resultDeviceId: DeviceViewModel = {
            ip: result.IP,
            title: 'string',
            lastActiveDate: issuedAt,
            deviceId: result.deviceId
        }
        return resultDeviceId

    }*/
}