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
exports.securityDeviceService = void 0;
const jwt_service_1 = require("../application/jwt-service");
const tokens_db_repository_1 = require("../repositories/tokens-db-repository");
exports.securityDeviceService = {
    getDeviceByToken(token, IP) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield jwt_service_1.jwtService.getUserIdByRefreshToken(token);
            const results = yield tokens_db_repository_1.tokensRepository.getTokenAndDevice(userId);
            if (results === null) {
                return null;
            }
            const resultDeviceIdOutput = results.map((b) => {
                return {
                    ip: b.IP,
                    title: b.deviceName,
                    lastActiveDate: b.issuedAt,
                    deviceId: b.deviceId
                };
            });
            return resultDeviceIdOutput;
        });
    },
    deleteDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield tokens_db_repository_1.tokensRepository.deleteDeviceId(deviceId);
            return result;
        });
    },
    getDeviceByUserId(refreshToken, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultDeviceId = yield jwt_service_1.jwtService.getDeviceIdByRefreshToken(refreshToken);
            const userByDeviceId = yield tokens_db_repository_1.tokensRepository.getUserByDeviceId(resultDeviceId);
            if (userByDeviceId === null) {
                return null;
            }
            if (resultDeviceId !== deviceId) {
                return false;
            }
            return true;
            //get userByDeviceId
            //if user not exist return {data: null, resultCode: ResultCodeEnum.NotFound}
            //if user exist but device id fon uri param not include in user devices
        });
    },
    deleteAllButOne(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = yield jwt_service_1.jwtService.getDeviceIdByRefreshToken(refreshToken);
            const userId = yield jwt_service_1.jwtService.getUserIdByRefreshToken(refreshToken);
            const res = yield tokens_db_repository_1.tokensRepository.deleteAllButOne(deviceId, userId);
            return res;
        });
    }
    /*async getDeviceByToken (token: string, IP:string): Promise<DeviceViewModel | null> {
        const issuedAt = await jwtService.getIssuedAttByRefreshToken(token)
        if (issuedAt=== null) {return null}
        const result = await tokensRepository.getTokenAndDevice(issuedAt)
        if (result=== null) {return null}

        const resultDeviceId: DeviceViewModel = {
            ip: result.IP,
            title: 'string',
            lastActiveDate: issuedAt,
            deviceId: result.deviceId
        }
        return resultDeviceId

    }*/
};
