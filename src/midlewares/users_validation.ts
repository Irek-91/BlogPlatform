import { body, validationResult } from "express-validator";


export const loginValidation = body('login').trim().notEmpty().isString().
                                            isLength({max: 10, min: 3}).
                                            matches('^[a-zA-Z0-9_-]*$').
                                            withMessage('error in login');
export const passwordValidation = body('password').trim().notEmpty().isString().
                                                  isLength({max: 20, min: 5}).
                                                  withMessage('error in password');

export const emailValidation = body('email').trim().notEmpty().isString().
                                            matches('').
                                            withMessage('error in email');



