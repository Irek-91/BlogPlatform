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
exports.authRouter = void 0;
const users_validation_1 = require("./../midlewares/users_validation");
const express_1 = require("express");
const aurh_validation_1 = require("../midlewares/aurh-validation");
const users_service_1 = require("../domain/users-service");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
const jwt_service_1 = require("../application/jwt-service");
const auth_middleware_1 = require("../midlewares/auth-middleware");
const users_validation_2 = require("../midlewares/users_validation");
const auth_service_1 = require("../domain/auth-service");
const email_adapter_1 = require("../application/email-adapter");
const token_service_1 = require("../domain/token-service");
const chek_refreshToket_1 = require("../midlewares/chek-refreshToket");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/login', aurh_validation_1.loginOrEmailValidationAuth, aurh_validation_1.passwordValidationAuth, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginOrEmail = req.body.loginOrEmail;
    const passwordUser = req.body.password;
    const newUser = yield users_service_1.usersService.checkCredentials(loginOrEmail, passwordUser);
    if (newUser) {
        const accessToken = yield jwt_service_1.jwtService.createdJWTAccessToken(newUser._id);
        const refreshToken = yield jwt_service_1.jwtService.createJWTRefreshToken(newUser._id);
        if (accessToken !== null || refreshToken !== null) {
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
            res.status(200).send({ accessToken });
        }
    }
    else {
        res.sendStatus(401);
    }
}));
exports.authRouter.post('/refresh-token', chek_refreshToket_1.chekRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookiesRefreshToken = req.cookies.refreshToken;
    const newAccessToken = yield token_service_1.tokensService.updateAccessTokens(cookiesRefreshToken);
    const newRefreshToken = yield token_service_1.tokensService.updateRefreshTokens(cookiesRefreshToken);
    if (newAccessToken !== null || newRefreshToken !== null) {
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
        res.status(200).send({ accessToken: newAccessToken });
    }
    else {
        res.status(401);
    }
}));
exports.authRouter.post('/logout', chek_refreshToket_1.chekRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookiesRefreshToken = req.cookies.refreshToken;
    const result = yield token_service_1.tokensService.deleteRefreshToken(cookiesRefreshToken);
    if (result === true) {
        res.clearCookie('refreshToken');
        res.sendStatus(204);
    }
    else {
        res.sendStatus(401);
    }
}));
exports.authRouter.get('/me', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user !== false) {
        const user = yield users_service_1.usersService.findByUserId(req.user._id);
        if (user !== false) {
            res.status(200).send(user);
        }
        else {
            res.sendStatus(401);
        }
    }
    else {
        res.sendStatus(401);
    }
}));
exports.authRouter.post('/registration', users_validation_2.loginValidation, users_validation_2.loginValidationLength, users_validation_1.passwordValidation, users_validation_2.emailValidation, users_validation_1.emailValidationCustom, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.authService.creatUser(req.body.login, req.body.password, req.body.email);
    if (user) {
        res.sendStatus(204);
    }
    else {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "if email is already confirmed",
                    field: "email"
                }
            ]
        });
    }
}));
exports.authRouter.post('/registration-confirmation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.confirmationCode(req.body.code);
    if (result) {
        res.sendStatus(204);
    }
    else {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "Error in code",
                    field: "code"
                }
            ]
        });
    }
}));
exports.authRouter.post('/registration-email-resending', users_validation_2.emailValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.resendingEmail(req.body.email);
    if (result) {
        res.sendStatus(204);
    }
    else {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "if email is already confirmed",
                    field: "email"
                }
            ]
        });
    }
}));
exports.authRouter.post('/registration-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const info = yield email_adapter_1.emailAdapter.sendEmail(req.body.email, req.body.subject, req.body.code);
    res.sendStatus(204);
}));
