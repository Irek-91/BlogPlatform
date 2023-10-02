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
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
const auth_middleware_1 = require("../midlewares/auth-middleware");
const users_validation_2 = require("../midlewares/users_validation");
const email_adapter_1 = require("../application/email-adapter");
const chek_refreshToket_1 = require("../midlewares/chek-refreshToket");
const count_IPAndURIFilter_1 = require("../midlewares/count-IPAndURIFilter");
const composition_root_1 = require("../composition-root");
exports.authRouter = (0, express_1.Router)({});
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
