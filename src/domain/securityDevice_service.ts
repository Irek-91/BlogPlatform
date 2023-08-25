import { NextFunction } from "express"
import { jwtService } from "../application/jwt-service"
import { tokensRepository } from "../repositories/tokens-db-repository"
import { ResultObject } from "../types/resultObject"
import { DeviceViewModel } from "../types/token-types"
import { refreshTokenCollections } from "../db/db-mongo"


export const securityDeviceService = {
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

    },

    async deleteDeviceId(deviceId: string): Promise<boolean | null> {
        const result = await tokensRepository.deleteDeviceId(deviceId)
        return result     
    },

    async getDeviceByUserId (refreshToken:string, deviceId:string): Promise<number> {
        //const resultDeviceId = await jwtService.getDeviceIdByRefreshToken(refreshToken)
        //const userByDeviceId = await tokensRepository.getUserByDeviceId(resultDeviceId)
        //const userByDeviceIdParams = await tokensRepository.getUserByDeviceId(deviceId)
        //if (userByDeviceId === null || userByDeviceIdParams === null) {return null}
        //if( resultDeviceId !== deviceId) {return false}
        //return true

        const resultDeviceId = await tokensRepository.findOneDeviceId(deviceId)
        if(!resultDeviceId) {return 404}
        const resultUserId = await jwtService.getUserIdByToken(refreshToken)
        if(resultDeviceId.userId.toString() !== resultUserId!.toString()) {return 403}
        else {const result = await tokensRepository.deleteDeviceId(deviceId)
        return 204}
        //get userByDeviceId
        //if user not exist return {data: null, resultCode: ResultCodeEnum.NotFound}
        //if user exist but device id fon uri param not include in user devices
    },

    async deleteAllDevicesExceptOne (refreshToken: string): Promise<Boolean | null> {
        const deviceId = await jwtService.getDeviceIdByRefreshToken(refreshToken)
        const userId = await jwtService.getUserIdByRefreshToken(refreshToken)

        const res = await tokensRepository.deleteAllDevicesExceptOne(deviceId, userId)
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