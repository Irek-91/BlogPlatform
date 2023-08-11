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
exports.tokensService = void 0;
const tokens_db_repository_1 = require("../repositories/tokens-db-repository");
const jwt_service_1 = require("../application/jwt-service");
exports.tokensService = {
    findToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return tokens_db_repository_1.tokensRepository.findToken(token);
        });
    },
    updateRefreshTokens(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield jwt_service_1.jwtService.getUserIdByRefreshToken(refreshToken);
            if (userId === null) {
                return null;
            }
            const result = yield tokens_db_repository_1.tokensRepository.addRefreshToken(refreshToken);
            if (result) {
                const newRefreshToken = yield jwt_service_1.jwtService.createJWTRefreshToken(userId);
                return newRefreshToken;
            }
            else {
                return null;
            }
        });
    },
    updateAccessTokens(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield jwt_service_1.jwtService.getUserIdByRefreshToken(refreshToken);
            if (userId === null) {
                return null;
            }
            const newRefreshToken = yield jwt_service_1.jwtService.createJWTRefreshToken(userId);
            return newRefreshToken;
        });
    },
    deleteRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield tokens_db_repository_1.tokensRepository.addRefreshToken(refreshToken);
            return result;
        });
    }
};
