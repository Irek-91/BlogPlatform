import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../application/jwt-service';

export const chekRefreshTokenDeleteDevice = async (req:Request, res: Response, next: NextFunction) => {
        const cookiesRefreshToken = req.cookies.refreshToken
        if (!cookiesRefreshToken) return res.sendStatus(401)
        const validationToken = await jwtService.checkingTokenKey(cookiesRefreshToken)
        if (validationToken === null) return res.sendStatus(401)
    

        next()
    }