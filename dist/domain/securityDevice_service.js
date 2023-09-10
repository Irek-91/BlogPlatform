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
exports.SecurityDeviceService = void 0;
const tokens_db_repository_1 = require("../repositories/tokens-db-repository");
const jwt_service_1 = require("../application/jwt-service");
class SecurityDeviceService {
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
    }
    deleteDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield tokens_db_repository_1.tokensRepository.deleteDeviceId(deviceId);
            return result;
        });
    }
    deleteDeviceByUserId(refreshToken, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultDeviceId = yield tokens_db_repository_1.tokensRepository.findOneDeviceId(deviceId);
            if (!resultDeviceId) {
                return 404;
            }
            const resultUserId = yield jwt_service_1.jwtService.getUserIdByToken(refreshToken);
            if (resultDeviceId.userId.toString() !== resultUserId.toString()) {
                return 403;
            }
            else {
                const result = yield tokens_db_repository_1.tokensRepository.deleteDeviceId(deviceId);
                return 204;
            }
        });
    }
    deleteAllDevicesExceptOne(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = yield jwt_service_1.jwtService.getDeviceIdByRefreshToken(refreshToken);
            const userId = yield jwt_service_1.jwtService.getUserIdByRefreshToken(refreshToken);
            const res = yield tokens_db_repository_1.tokensRepository.deleteAllDevicesExceptOne(deviceId, userId);
            return res;
        });
    }
}
exports.SecurityDeviceService = SecurityDeviceService;
