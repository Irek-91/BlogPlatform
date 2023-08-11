import { ObjectId } from "mongodb"

export type refreshToken = {
    token: string,
    validToken: boolean
}

export type refreshTokenMongo = {
    _id: ObjectId,
    token: string,
}