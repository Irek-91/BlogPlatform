"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailValidation = exports.passwordValidation = exports.loginValidationLength = exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidation = (0, express_validator_1.body)('login').trim().notEmpty().
    matches('^[a-zA-Z0-9_-]*$').
    withMessage('error in login');
exports.loginValidationLength = (0, express_validator_1.body)('login').isString().
    isLength({ max: 10, min: 3 }).
    withMessage('error in login length');
exports.passwordValidation = (0, express_validator_1.body)('password').trim().notEmpty().isString().
    isLength({ max: 20, min: 6 }).
    withMessage('error in password');
exports.emailValidation = (0, express_validator_1.body)('email').trim().notEmpty().
    matches(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/).
    withMessage('error in email');
