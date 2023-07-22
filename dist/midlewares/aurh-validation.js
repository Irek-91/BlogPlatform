"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidation = exports.loginOrEmailValidation = void 0;
const express_validator_1 = require("express-validator");
exports.loginOrEmailValidation = (0, express_validator_1.body)('loginOrEmail').trim().notEmpty().isString().withMessage('error in login or email');
exports.passwordValidation = (0, express_validator_1.body)('password').trim().notEmpty().isString().withMessage('error in password');
