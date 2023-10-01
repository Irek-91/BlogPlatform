import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../application/jwt-service';
import { TokensService } from '../domain/token-service';
import { tokensService } from '../composition-root';


export const chekRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const cookiesRefreshToken = req.cookies.refreshToken
    if (!cookiesRefreshToken) return res.sendStatus(401)
    const validationToken = await jwtService.checkingTokenKey(cookiesRefreshToken)
    if (validationToken === null) return res.sendStatus(401)


    const expiredToken = await tokensService.findTokenAndDevice(cookiesRefreshToken)
    if (expiredToken === null) return res.sendStatus(401)

    next()
}