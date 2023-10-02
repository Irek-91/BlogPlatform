import { refreshToken } from './../types/token-types';
import { Request, Response, Router } from "express";
import { chekRefreshToken } from "../midlewares/chek-refreshToket";
import { chekRefreshTokenDeleteDevice } from '../midlewares/chek-refreshToket-delete';
import { SecurityDeviceService } from '../domain/securityDevice_service';
import { securityDeviceController } from '../composition-root';

export const securityDeviceRouter = Router({});

securityDeviceRouter.get('/devices', chekRefreshToken,
    securityDeviceController.getDeviceByToken.bind(securityDeviceController))
securityDeviceRouter.delete('/devices', chekRefreshToken,
    securityDeviceController.deleteAllDevicesExceptOne.bind(securityDeviceController))
securityDeviceRouter.delete('/devices/:deviceId', chekRefreshTokenDeleteDevice,
    securityDeviceController.deleteDeviceByUserId.bind(securityDeviceController))