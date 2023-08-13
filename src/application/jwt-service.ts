import { settings } from './../settings';
import jwt from 'jsonwebtoken'
import { userMongoModel } from '../types/user'
import { ObjectId } from 'mongodb';
import { userRepository } from '../repositories/users-db-repository';
import { tokensRepository } from '../repositories/tokens-db-repository';
import { refreshTokenMongo } from '../types/token-types';


export const jwtService = {
    async createdJWTAccessToken (userId : ObjectId) {
        const accessToken = jwt.sign({userId : userId}, settings.JWT_SECRET, {expiresIn: '10'})
        /*const addTokenUser = await userRepository.addNewAccessToken(user._id, accessToken)
        if (addTokenUser) {return accessToken}
        else {return null}*/
        return accessToken
        
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

    async createJWTRefreshToken (userId: ObjectId): Promise< string | null> {
        const refreshToken = jwt.sign({userId: userId}, settings.JWT_SECRET, {expiresIn: '20'})
        /*const addTokenUser = await userRepository.addNewrefreshToken(user._id, refreshToken)
        if (addTokenUser) {return refreshToken}
        else {return null}
        */
       return refreshToken
    },

    async findToken (token: string): Promise<refreshTokenMongo | null> {
        return tokensRepository.findToken(token)
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
