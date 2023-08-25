"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityDeviceRouter = void 0;
const express_1 = require("express");
const chek_refreshToket_1 = require("../midlewares/chek-refreshToket");
const securityDevice_service_1 = require("../domain/securityDevice_service");
const chek_refreshToket_delete_1 = require("../midlewares/chek-refreshToket-delete");
exports.securityDeviceRouter = (0, express_1.Router)({});
exports.securityDeviceRouter.get('/devices', chek_refreshToket_1.chekRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const IP = req.ip;
    const resultGetDevice = yield securityDevice_service_1.securityDeviceService.getDeviceByToken(refreshToken, IP);
    if (resultGetDevice) {
        res.status(200).send(resultGetDevice);
    }
    else {
        res.sendStatus(401);
    }
}));
exports.securityDeviceRouter.delete('/devices', chek_refreshToket_1.chekRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const resultDelete = yield securityDevice_service_1.securityDeviceService.deleteAllDevicesExceptOne(refreshToken);
    if (resultDelete) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(401);
    }
}));
exports.securityDeviceRouter.delete('/devices/:deviceId', chek_refreshToket_delete_1.chekRefreshTokenDeleteDevice, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const deviceId = req.params.deviceId;
    const result = yield securityDevice_service_1.securityDeviceService.getDeviceByUserId(refreshToken, deviceId);
    return res.sendStatus(result);
}));
