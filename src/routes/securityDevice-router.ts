import { refreshToken } from './../types/token-types';
import { Request, Response, Router } from "express";
import { chekRefreshToken } from "../midlewares/chek-refreshToket";
import { chekRefreshTokenDeleteDevice } from '../midlewares/chek-refreshToket-delete';
import { SecurityDeviceService } from '../domain/securityDevice_service';

export const securityDeviceRouter = Router({});

class SecurityDeviceController {
    private securityDeviceService: SecurityDeviceService
    constructor() {
        this.securityDeviceService = new SecurityDeviceService()
    }
    async getDeviceByToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const IP = req.ip
        const resultGetDevice = await this.securityDeviceService.getDeviceByToken(refreshToken, IP)

        if (resultGetDevice) {
            res.status(200).send(resultGetDevice)
        }
        else {
            res.sendStatus(401)
        }
    }
    async deleteAllDevicesExceptOne(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const resultDelete = await this.securityDeviceService.deleteAllDevicesExceptOne(refreshToken)
        if (resultDelete) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(401)
        }
    }
    async deleteDeviceByUserId(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const deviceId = req.params.deviceId
        const result = await this.securityDeviceService.deleteDeviceByUserId(refreshToken, deviceId)

        return res.sendStatus(result)



    }
}

const securityDeviceControllerInstance = new SecurityDeviceController()
securityDeviceRouter.get('/devices', chekRefreshToken,
    securityDeviceControllerInstance.getDeviceByToken.bind(securityDeviceControllerInstance))
securityDeviceRouter.delete('/devices', chekRefreshToken,
    securityDeviceControllerInstance.deleteAllDevicesExceptOne.bind(securityDeviceControllerInstance))
securityDeviceRouter.delete('/devices/:deviceId', chekRefreshTokenDeleteDevice,
    securityDeviceControllerInstance.deleteDeviceByUserId.bind(securityDeviceControllerInstance))