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
exports.TokensService = void 0;
const token_types_1 = require("./../types/token-types");
const tokens_db_repository_1 = require("../repositories/tokens-db-repository");
const mongodb_1 = require("mongodb");
const jwt_service_1 = require("../application/jwt-service");
class TokensService {
    findTokenAndDevice(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const issuedAt = yield jwt_service_1.jwtService.getIssueAttByRefreshToken(token);
            const resultIssuedAt = yield tokens_db_repository_1.tokensRepository.findTokenAndDeviceByissuedAt(issuedAt);
            if (resultIssuedAt) {
                return true;
            }
            else {
                return null;
            }
        });
    }
    addDeviceIdRefreshToken(userId, deviceId, IP, deviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = yield jwt_service_1.jwtService.createJWTRefreshToken(userId, deviceId);
            const issuedAt = yield jwt_service_1.jwtService.getIssueAttByRefreshToken(refreshToken);
            const expirationDate = yield jwt_service_1.jwtService.getExpiresAttByRefreshToken(refreshToken);
            const newDeviceAndRefreshToken = new token_types_1.DevicesMongo(new mongodb_1.ObjectId(), issuedAt, expirationDate, deviceId, IP, deviceName, userId);
            const addTokenUser = yield tokens_db_repository_1.tokensRepository.addRefreshToken(newDeviceAndRefreshToken);
            if (addTokenUser !== true) {
                return null;
            }
            return refreshToken;
        });
    }
    updateAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield jwt_service_1.jwtService.getUserIdByRefreshToken(refreshToken);
            if (userId === null) {
                return null;
            }
            const newAccessToken = yield jwt_service_1.jwtService.createdJWTAccessToken(userId);
            return newAccessToken;
        });
    }
    updateDevicesModelClass(refreshToken, IP, deviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield jwt_service_1.jwtService.getUserIdByRefreshToken(refreshToken);
            if (userId === null) {
                return null;
            }
            const deviceId = yield jwt_service_1.jwtService.getDeviceIdByRefreshToken(refreshToken);
            if (deviceId === null) {
                return null;
            }
            const issuedAt = yield jwt_service_1.jwtService.getIssuedAttByRefreshToken(refreshToken);
            if (issuedAt === null) {
                return null;
            }
            const resultDelete = yield tokens_db_repository_1.tokensRepository.deleteTokenAndDevice(issuedAt);
            if (resultDelete === null) {
                return null;
            }
            const result = yield this.addDeviceIdRefreshToken(userId, deviceId, IP, deviceName);
            if (result) {
                return result;
            }
            else {
                return null;
            }
        });
    }
    deleteDeviceIdRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const issuedAt = yield jwt_service_1.jwtService.getIssuedAttByRefreshToken(refreshToken);
            if (issuedAt === null) {
                return null;
            }
            const resultDelete = yield tokens_db_repository_1.tokensRepository.deleteTokenAndDevice(issuedAt);
            if (resultDelete === null) {
                return null;
            }
            return true;
        });
    }
}
exports.TokensService = TokensService;
