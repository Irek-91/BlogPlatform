import { refreshToken } from './../types/token-types';
import { Request, Response, Router } from "express";
import { chekRefreshToken } from "../midlewares/chek-refreshToket";
import { securityDeviceService } from '../domain/securityDevice_service';
import { chekRefreshTokenDeleteDevice } from '../midlewares/chek-refreshToket-delete';

export const securityDeviceRouter = Router({});


securityDeviceRouter.get('/devices',
    chekRefreshToken,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        const IP = req.ip
        const resultGetDevice = await  securityDeviceService.getDeviceByToken(refreshToken, IP)

        if (resultGetDevice) {
            res.status(200).send(resultGetDevice)
        }
        else {
            res.sendStatus(401)
        }
    }
)

securityDeviceRouter.delete('/devices',
    chekRefreshToken,    
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        

        const resultDelete = await securityDeviceService.deleteAllDevicesExceptOne(refreshToken)
        if (resultDelete) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(401)
        }
    }
)


securityDeviceRouter.delete('/devices/:deviceId',
    chekRefreshTokenDeleteDevice,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        const deviceId = req.params.deviceId
        const result = await securityDeviceService.getDeviceByUserId(refreshToken, deviceId)
    
        return res.sendStatus(result)
        
        
        
})