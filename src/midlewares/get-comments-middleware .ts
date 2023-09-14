import { Request, Response, NextFunction } from 'express';
import { userRepository } from '../repositories/users-db-repository';
import { jwtService } from '../application/jwt-service';


export const getCommentsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) {
        
        next()
    } else {
        const token = req.headers.authorization.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token)
            if (userId !== null) {
                const result = await userRepository.findUserById(userId)
                    if (result === false) {
                        return 
                    }
                else {
                    req.user = result
                    next()
                }
    }
    else {next()}
}
}


