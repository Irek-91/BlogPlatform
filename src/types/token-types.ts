import { ObjectId } from "mongodb"

export type refreshToken = {
    token: string,
    validToken: boolean
}

export type refreshTokenMongo = {
    _id: ObjectId,
    issuedAt: Date,
    expirationDate: Date,
    deviceId: string,
    IP: string,
    deviceName: string,
    userId: ObjectId
}



export type DeviceViewModel = {
    ip : string,
    title: string,
    lastActiveDate: Date,
    deviceId: string
}