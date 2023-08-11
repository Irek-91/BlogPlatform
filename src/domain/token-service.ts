import { refreshToken } from './../types/token-types';
import { tokensRepository } from "../repositories/tokens-db-repository"
import { refreshTokenMongo } from "../types/token-types"
import { jwtService } from '../application/jwt-service';


export const tokensService = {
    async findToken (token: string): Promise<refreshTokenMongo | null> {
        return tokensRepository.findToken(token)
    },

    async updateRefreshTokens (refreshToken: string): Promise<string | null> {
        const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
        if (userId === null) {return null}
        const result = await tokensRepository.addRefreshToken(refreshToken)
        if (result) {
            const newRefreshToken = await jwtService.createJWTRefreshToken(userId)
            return newRefreshToken
        }
        else {return null}
    },
    async updateAccessTokens (refreshToken: string): Promise<string | null> {
        const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
        if (userId === null) {return null}
        const newRefreshToken = await jwtService.createJWTRefreshToken(userId)
        return newRefreshToken
    },

    async deleteRefreshToken(refreshToken: string): Promise <boolean> {
        const result = await tokensRepository.addRefreshToken(refreshToken)
        return result
    } 
    
}
