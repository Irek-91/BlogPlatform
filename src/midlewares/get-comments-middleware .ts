import { Request, Response, NextFunction } from 'express';
import { userRepository } from '../repositories/users-db-repository';
import { jwtService } from '../application/jwt-service';
import jwt from 'jsonwebtoken'


export const getCommentsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization)  return next()
    
        const token = req.headers.authorization.split(' ')[1]
        const payload: any = jwt.decode(token)
        req.userId = payload.userId ? payload.userId : null
        return next()

}


