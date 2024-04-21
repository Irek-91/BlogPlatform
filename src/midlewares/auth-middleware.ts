import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../application/jwt-service';
import { userRepository } from '../composition-root';
import {ObjectId} from "mongodb";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const token: string = req.headers.authorization.split(' ')[1]
    const userId: ObjectId | null = await jwtService.getUserIdByToken(token)
    if (userId !== null) {
        const result = await userRepository.findUserById(userId)
        if (result === false) {
            res.sendStatus(401)
        }
        else {
            req.user = result
            next()
        }
    }
    else { res.sendStatus(401) }
}


