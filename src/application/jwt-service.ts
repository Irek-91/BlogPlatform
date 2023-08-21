import { settings } from './../settings';
import jwt from 'jsonwebtoken'
import { userMongoModel } from '../types/user'
import { ObjectId } from 'mongodb';
import { userRepository } from '../repositories/users-db-repository';
import { tokensRepository } from '../repositories/tokens-db-repository';
import { refreshTokenMongo } from '../types/token-types';


export const jwtService = {
    async createdJWTAccessToken (userId : ObjectId) {
        const accessToken = jwt.sign({userId : userId}, settings.JWT_SECRET, {expiresIn: 10})
        return accessToken
        
    },

    async createJWTRefreshToken (userId: ObjectId, deviceId: string): Promise< string> {
        const refreshToken = jwt.sign({userId: userId, deviceId: deviceId}, settings.JWT_SECRET, {expiresIn: 20})
        return refreshToken
    },



    async getUserIdByToken (token: string) : Promise<ObjectId | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } 
        catch (e) {
            return null
        }
    },

    async getUserIdByRefreshToken (token: string) : Promise<ObjectId | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } 
        catch (e) {
            return null
        }
    },

    async getDeviceIdByRefreshToken (token: string) : Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.deviceId
        } 
        catch (e) {
            return null
        }
    },


    async getIssuedAttByRefreshToken (token: string) : Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return (new Date ((result.iat)*1000)).toISOString()
        }
        catch (e) {
            return null
        }
    },

    async getExpiresAttByRefreshToken (token: string) : Promise<string> {
            const result: any = jwt.decode(token)
            return (new Date ((result.exp)*1000)).toISOString()
    },


    async getIssueAttByRefreshToken (token: string) : Promise<string> {
        const result: any = jwt.decode(token)
        return (new Date ((result.iat)*1000)).toISOString()
},

    async checkingTokenKey (token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result
        } 
        catch (e) {
            return null
        }
    }


}
