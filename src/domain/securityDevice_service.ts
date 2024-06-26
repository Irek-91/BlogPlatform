import {DeviceViewModel} from "../types/token-types"
import {jwtService} from "../application/jwt-service"
import {TokensRepository} from "../repositories/tokens-db-repository"


export class SecurityDeviceService {
    constructor(protected tokensRepository: TokensRepository) {}
    async getDeviceByToken(token: string, IP: string): Promise<DeviceViewModel[] | null> {
        const userId = await jwtService.getUserIdByRefreshToken(token)
        const results = await this.tokensRepository.getTokenAndDevice(userId)
        if (results === null) { return null }

        return results.map((b) => {
            return {
                ip: b.IP,
                title: b.deviceName,
                lastActiveDate: b.issuedAt,
                deviceId: b.deviceId
            }
        })

    }

    async deleteDeviceId(deviceId: string): Promise<boolean | null> {
        return await this.tokensRepository.deleteDeviceId(deviceId)
    }

    async deleteDeviceByUserId(refreshToken: string, deviceId: string): Promise<number> {

        const resultDeviceId = await this.tokensRepository.findOneDeviceId(deviceId)
        if (!resultDeviceId) { return 404 }
        const resultUserId = await jwtService.getUserIdByToken(refreshToken)
        if (resultDeviceId.userId.toString() !== resultUserId!.toString()) { return 403 }
        else {
            const result = await this.tokensRepository.deleteDeviceId(deviceId)
            return 204
        }
    }

    async deleteAllDevicesExceptOne(refreshToken: string): Promise<Boolean | null> {
        const deviceId = await jwtService.getDeviceIdByRefreshToken(refreshToken)
        const userId = await jwtService.getUserIdByRefreshToken(refreshToken)

        return await this.tokensRepository.deleteAllDevicesExceptOne(deviceId, userId)
    }
}

