"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailValidation = exports.passwordValidation = exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidation = (0, express_validator_1.body)('login').trim().notEmpty().isString().
    isLength({ max: 10, min: 3 }).
    matches('^[a-zA-Z0-9_-]*$').
    withMessage('error in login');
exports.passwordValidation = (0, express_validator_1.body)('password').trim().notEmpty().isString().
    isLength({ max: 20, min: 5 }).
    withMessage('error in password');
exports.emailValidation = (0, express_validator_1.body)('email').trim().notEmpty().isString().
    matches('').
    withMessage('error in email');
