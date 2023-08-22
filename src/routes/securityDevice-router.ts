import { refreshToken } from './../types/token-types';
import { Request, Response, Router } from "express";
import { chekRefreshToken } from "../midlewares/chek-refreshToket";
import { securityDeviceService } from '../domain/securityDevice_service';

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
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        const resultDelete = await securityDeviceService.deleteAllButOne(refreshToken)
        if (resultDelete) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(401)
        }
    }
)


securityDeviceRouter.delete('/devices/:deviceId',
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        const deviceId = req.params.deviceId
        const deviceIdByUser = await securityDeviceService.getDeviceByUserId(refreshToken, deviceId)
        if (deviceIdByUser === false) {
            return res.sendStatus(403)
        }

        const resultDeleteDeviceId = await securityDeviceService.deleteDeviceId(deviceId)

        if (resultDeleteDeviceId) {
            return res.sendStatus(204)
        }
    }
)