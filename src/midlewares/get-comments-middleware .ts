import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'


export const getUserMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.headers.authorization) return next()
    const token: string = req.headers.authorization.split(' ')[1]
    const payload: any = jwt.decode(token)
    req.userId = payload.userId ? payload.userId : null
    return next()
}


