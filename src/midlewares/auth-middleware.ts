import { Request, Response, NextFunction } from 'express';
import { userRepository } from '../repositories/users-db-repository';
import { jwtService } from '../application/jwt-service';


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if (userId !== null) {
        const result = await userRepository.findUserById(userId)
            if (result === false) {
                res.sendStatus(401)
            }
            else {
                req.user = result
                next()}
    }
    else {res.sendStatus(401)}
}


