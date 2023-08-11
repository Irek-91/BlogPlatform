import { body, validationResult } from "express-validator";

export const loginOrEmailValidationAuth = body('loginOrEmail').trim().notEmpty().isString().withMessage('error in login or email');

export const passwordValidationAuth = body('password').trim().notEmpty().isString().withMessage('error in password');

