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
exports.AuthController = exports.authRouter = void 0;
const users_validation_1 = require("./../midlewares/users_validation");
const express_1 = require("express");
const aurh_validation_1 = require("../midlewares/aurh-validation");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
const jwt_service_1 = require("../application/jwt-service");
const auth_middleware_1 = require("../midlewares/auth-middleware");
const users_validation_2 = require("../midlewares/users_validation");
const email_adapter_1 = require("../application/email-adapter");
const chek_refreshToket_1 = require("../midlewares/chek-refreshToket");
const uuid_1 = require("uuid");
const count_IPAndURIFilter_1 = require("../midlewares/count-IPAndURIFilter");
const composition_root_1 = require("../composition-root");
exports.authRouter = (0, express_1.Router)({});
class AuthController {
    constructor(usersService, tokensService, authService) {
        this.usersService = usersService;
        this.tokensService = tokensService;
        this.authService = authService;
    }
    loginUserToTheSystem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginOrEmail = req.body.loginOrEmail;
            const passwordUser = req.body.password;
            const divicId = (0, uuid_1.v4)();
            const IP = req.ip;
            const title = req.headers['user-agent'] || 'custom-ua';
            const newUser = yield this.usersService.checkCredentials(loginOrEmail, passwordUser);
            if (newUser === false)
                return res.sendStatus(401);
            const accessToken = yield jwt_service_1.jwtService.createdJWTAccessToken(newUser._id);
            const refreshToken = yield this.tokensService.addDeviceIdRefreshToken(newUser._id, divicId, IP, title);
            if (accessToken !== null || refreshToken !== null) {
                res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
                res.status(200).send({ accessToken });
            }
            else {
                res.sendStatus(401);
            }
        });
    }
    generateNewPairOfAccessAndRefreshTokens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookiesRefreshToken = req.cookies.refreshToken;
            const IP = req.ip;
            const title = req.headers['user-agent'] || 'custom-ua';
            const newAccessToken = yield this.tokensService.updateAccessToken(cookiesRefreshToken);
            const newRefreshToken = yield this.tokensService.updateDevicesModelClass(cookiesRefreshToken, IP, title);
            if (newAccessToken !== null || newRefreshToken !== null) {
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
                res.status(200).send({ accessToken: newAccessToken });
            }
            else {
                res.sendStatus(401);
            }
        });
    }
    sendCorrectRefreshTokenThatWillBeRevoked(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookiesRefreshToken = req.cookies.refreshToken;
            const result = yield this.tokensService.deleteDeviceIdRefreshToken(cookiesRefreshToken);
            if (result === true) {
                res.clearCookie('refreshToken');
                res.sendStatus(204);
            }
            else {
                res.sendStatus(401);
            }
        });
    }
    getInformationAboutCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user !== false) {
                const user = yield this.usersService.findByUserId(req.user._id);
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
        });
    }
    codeWillBeSendToPassedEmailAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authService.creatUser(req.body.login, req.body.password, req.body.email);
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
        });
    }
    confirmRegistrationCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.confirmationCode(req.body.code);
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
        });
    }
    resendConfirmationRegistrationEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.resendingEmail(req.body.email);
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
        });
    }
    passwordRecoveryViaEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.passwordRecovery(req.body.email);
            res.sendStatus(204);
        });
    }
    confirmNewPasswordRecovery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPassword = req.body.newPassword;
            const recoveryCode = req.body.recoveryCode;
            const result = yield this.authService.newPassword(newPassword, recoveryCode);
            if (result) {
                res.sendStatus(204);
            }
            else {
                res.status(400).send({
                    errorsMessages: [
                        {
                            message: "RecoveryCode is incorrect or expired",
                            field: "recoveryCode"
                        }
                    ]
                });
            }
        });
    }
}
exports.AuthController = AuthController;
exports.authRouter.post('/login', count_IPAndURIFilter_1.filterCountIPAndURL, aurh_validation_1.loginOrEmailValidationAuth, aurh_validation_1.passwordValidationAuth, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.authController.loginUserToTheSystem.bind(composition_root_1.authController));
exports.authRouter.post('/refresh-token', chek_refreshToket_1.chekRefreshToken, composition_root_1.authController.generateNewPairOfAccessAndRefreshTokens.bind(composition_root_1.authController));
exports.authRouter.post('/logout', chek_refreshToket_1.chekRefreshToken, composition_root_1.authController.sendCorrectRefreshTokenThatWillBeRevoked.bind(composition_root_1.authController));
exports.authRouter.get('/me', auth_middleware_1.authMiddleware, composition_root_1.authController.getInformationAboutCurrentUser.bind(composition_root_1.authController));
exports.authRouter.post('/registration', count_IPAndURIFilter_1.filterCountIPAndURL, users_validation_2.loginValidation, users_validation_1.emailValidationCustom, users_validation_2.loginValidationLength, users_validation_1.passwordValidation, users_validation_2.emailValidation, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.authController.sendCorrectRefreshTokenThatWillBeRevoked.bind(composition_root_1.authController));
exports.authRouter.post('/registration-confirmation', count_IPAndURIFilter_1.filterCountIPAndURL, composition_root_1.authController.confirmRegistrationCode.bind(composition_root_1.authController));
exports.authRouter.post('/registration-email-resending', count_IPAndURIFilter_1.filterCountIPAndURL, users_validation_2.emailValidation, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.authController.resendConfirmationRegistrationEmail.bind(composition_root_1.authController));
exports.authRouter.post('/password-recovery', count_IPAndURIFilter_1.filterCountIPAndURL, users_validation_2.emailValidation, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.authController.passwordRecoveryViaEmail.bind(composition_root_1.authController));
exports.authRouter.post('/new-password', count_IPAndURIFilter_1.filterCountIPAndURL, users_validation_1.newPasswordValidation, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.authController.confirmNewPasswordRecovery.bind(composition_root_1.authController));
exports.authRouter.post('/registration-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const info = yield email_adapter_1.emailAdapter.sendEmail(req.body.email, req.body.subject, req.body.code);
    res.sendStatus(204);
}));
