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
exports.chekRefreshToken = void 0;
const jwt_service_1 = require("../application/jwt-service");
const token_service_1 = require("../domain/token-service");
const chekRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookiesRefreshToken = req.cookies.refreshToken;
    if (!cookiesRefreshToken)
        return res.sendStatus(401);
    const validationToken = yield jwt_service_1.jwtService.checkingTokenKey(cookiesRefreshToken);
    if (validationToken === null)
        return res.sendStatus(401);
    const expiredToken = yield token_service_1.tokensService.findTokenAndDevice(cookiesRefreshToken);
    if (expiredToken === null)
        return res.sendStatus(401);
    next();
});
exports.chekRefreshToken = chekRefreshToken;
