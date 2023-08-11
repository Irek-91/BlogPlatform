"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidationAuth = exports.loginOrEmailValidationAuth = void 0;
const express_validator_1 = require("express-validator");
exports.loginOrEmailValidationAuth = (0, express_validator_1.body)('loginOrEmail').trim().notEmpty().isString().withMessage('error in login or email');
exports.passwordValidationAuth = (0, express_validator_1.body)('password').trim().notEmpty().isString().withMessage('error in password');
