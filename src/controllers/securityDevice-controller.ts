import { Request, Response, Router } from "express";
import { SecurityDeviceService } from '../domain/securityDevice_service';

export class SecurityDeviceController {
    constructor(protected securityDeviceService: SecurityDeviceService) {}
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
