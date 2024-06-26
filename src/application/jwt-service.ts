import {settings} from './../settings';
import jwt from 'jsonwebtoken'
import {ObjectId} from 'mongodb';


export const jwtService = {
    async createdJWTAccessToken (userId : ObjectId) {
        return jwt.sign({userId: userId}, settings.JWT_SECRET, {expiresIn: 600})
    },

    async createJWTRefreshToken (userId: ObjectId, deviceId: string): Promise< string> {
        return jwt.sign({userId: userId, deviceId: deviceId}, settings.JWT_SECRET, {expiresIn: 200})
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

    async getUserIdByRefreshToken (token: string) : Promise<ObjectId> {
            const result: any = jwt.decode(token)
            return new ObjectId(result.userId)
        
    },

    async getDeviceIdByRefreshToken (token: string) : Promise<string> {
            const result: any = jwt.decode(token)
            return result.deviceId
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
    },
    async getUserIdByAccessToken (token: string) : Promise<string | null> {
            const result: any = jwt.decode(token)
            return result.userId
        
    }
}
