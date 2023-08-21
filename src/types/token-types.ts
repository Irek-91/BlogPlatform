import { ObjectId } from "mongodb"

export type refreshToken = {
    token: string,
    validToken: boolean
}

export type refreshTokenMongo = {
    _id: ObjectId,
    issuedAt: string,
    expirationDate: string,
    deviceId: string,
    IP: string,
    deviceName: string,
    userId: ObjectId
}



export type DeviceViewModel = {
    ip : string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}