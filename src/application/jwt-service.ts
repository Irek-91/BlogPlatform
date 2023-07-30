import { settings } from './../settings';
import jwt from 'jsonwebtoken'
import { userMongoModel } from '../types/user'
import { ObjectId } from 'mongodb';


export const jwtService = {
    async createJWT (user : userMongoModel) {
        const token = jwt.sign({userId : user._id}, settings.JWT_SECRET, {expiresIn: '8h'}) 
        return token
    },

    async getUserIdByToken (token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } 
        catch (e) {
            return null
        }
    }
}
