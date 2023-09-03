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
exports.newPasswordValidation = exports.emailValidationCustom = exports.emailValidation = exports.passwordValidation = exports.loginValidationLength = exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
const users_db_repository_1 = require("../repositories/users-db-repository");
exports.loginValidation = (0, express_validator_1.body)('login').trim().notEmpty().
    matches('^[a-zA-Z0-9_-]*$').
    withMessage('error in login').
    custom((login) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_db_repository_1.userRepository.findUserByLogin(login);
    if (user) {
        throw new Error("User ");
    }
    return true;
}));
exports.loginValidationLength = (0, express_validator_1.body)('login').isString().
    isLength({ max: 10, min: 3 }).
    withMessage('error in login length');
exports.passwordValidation = (0, express_validator_1.body)('password').trim().notEmpty().isString().
    isLength({ max: 20, min: 6 }).
    withMessage('error in password');
exports.emailValidation = (0, express_validator_1.body)('email').trim().notEmpty().
    matches(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/).
    withMessage('error in email');
exports.emailValidationCustom = (0, express_validator_1.body)('email').
    custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_db_repository_1.userRepository.findUserByEmail(email);
    if (user) {
        throw new Error("user with the given email already exists");
    }
    return true;
}));
const newPasswordValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = req.body.newPassword;
    if (newPassword.length > 20 || newPassword.length < 6) {
        res.status(400).send({
            message: "newPassword is incorrect",
            field: "newPassword"
        });
    }
    else {
        next();
    }
});
exports.newPasswordValidation = newPasswordValidation;
