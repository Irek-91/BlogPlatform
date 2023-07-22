import { body, validationResult } from "express-validator";

export const loginOrEmailValidation = body('loginOrEmail').trim().notEmpty().isString().withMessage('error in login or email');

export const passwordValidation = body('password').trim().notEmpty().isString().withMessage('error in password');