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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const settings_1 = require("./../settings");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
const tokens_db_repository_1 = require("../repositories/tokens-db-repository");
exports.jwtService = {
    createdJWTAccessToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = jsonwebtoken_1.default.sign({ userId: userId }, settings_1.settings.JWT_SECRET, { expiresIn: 10 });
            /*const addTokenUser = await userRepository.addNewAccessToken(user._id, accessToken)
            if (addTokenUser) {return accessToken}
            else {return null}*/
            return accessToken;
        });
    },
    getUserIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, settings_1.settings.JWT_SECRET);
                return new mongodb_1.ObjectId(result.userId);
            }
            catch (e) {
                return null;
            }
        });
    },
    getUserIdByRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, settings_1.settings.JWT_SECRET);
                return new mongodb_1.ObjectId(result.userId);
            }
            catch (e) {
                return null;
            }
        });
    },
    createJWTRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = jsonwebtoken_1.default.sign({ userId: userId }, settings_1.settings.JWT_SECRET, { expiresIn: 20 });
            /*const addTokenUser = await userRepository.addNewrefreshToken(user._id, refreshToken)
            if (addTokenUser) {return refreshToken}
            else {return null}
            */
            return refreshToken;
        });
    },
    findToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return tokens_db_repository_1.tokensRepository.findToken(token);
        });
    },
    checkingTokenKey(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, settings_1.settings.JWT_SECRET);
                return result;
            }
            catch (e) {
                return null;
            }
        });
    }
};
