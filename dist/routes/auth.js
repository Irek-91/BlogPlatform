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
const express_1 = require("express");
const aurh_validation_1 = require("../midlewares/aurh-validation");
const users_service_1 = require("../domain/users-service");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/', aurh_validation_1.loginOrEmailValidation, aurh_validation_1.passwordValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginOrEmail = req.body.loginOrEmail;
    const passwordUser = req.body.password;
    const newUser = yield users_service_1.usersService.checkCredentials(loginOrEmail, passwordUser);
    if (newUser === true) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(401);
    }
}));
