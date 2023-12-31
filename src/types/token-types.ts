import { ObjectId } from "mongodb"

export type refreshToken = {
    token: string,
    validToken: boolean
}

export type devicesMongo = {
    _id: ObjectId,
    issuedAt: string,
    expirationDate: string,
    deviceId: string,
    IP: string,
    deviceName: string,
    userId: ObjectId
}

export class DevicesMongo {
    constructor(public _id: ObjectId,
        public expirationDate: string,
        public deviceId: string,
        public IP: string,
        public issuedAt: string,
        public deviceName: string,
        public userId: ObjectId) { }
}



export type DeviceViewModel = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}