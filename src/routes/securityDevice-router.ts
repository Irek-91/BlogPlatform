import { Request, Response, Router } from "express";
import { checkRefreshToken } from "../midlewares/chek-refreshToket";
import { checkRefreshTokenDeleteDevice } from '../midlewares/chek-refreshToket-delete';
import { securityDeviceController } from '../composition-root';

export const securityDeviceRouter = Router({});

securityDeviceRouter.get('/devices', checkRefreshToken,
    securityDeviceController.getDeviceByToken.bind(securityDeviceController))
securityDeviceRouter.delete('/devices', checkRefreshToken,
    securityDeviceController.deleteAllDevicesExceptOne.bind(securityDeviceController))
securityDeviceRouter.delete('/devices/:deviceId', checkRefreshTokenDeleteDevice,
    securityDeviceController.deleteDeviceByUserId.bind(securityDeviceController))