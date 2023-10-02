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
exports.SecurityDeviceController = void 0;
class SecurityDeviceController {
    constructor(securityDeviceService) {
        this.securityDeviceService = securityDeviceService;
    }
    getDeviceByToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const IP = req.ip;
            const resultGetDevice = yield this.securityDeviceService.getDeviceByToken(refreshToken, IP);
            if (resultGetDevice) {
                res.status(200).send(resultGetDevice);
            }
            else {
                res.sendStatus(401);
            }
        });
    }
    deleteAllDevicesExceptOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const resultDelete = yield this.securityDeviceService.deleteAllDevicesExceptOne(refreshToken);
            if (resultDelete) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(401);
            }
        });
    }
    deleteDeviceByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const deviceId = req.params.deviceId;
            const result = yield this.securityDeviceService.deleteDeviceByUserId(refreshToken, deviceId);
            return res.sendStatus(result);
        });
    }
}
exports.SecurityDeviceController = SecurityDeviceController;
