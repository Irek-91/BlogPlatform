import { body, validationResult } from "express-validator";


export const loginValidation = body('login').trim().notEmpty().
                                            matches('^[a-zA-Z0-9_-]*$').
                                            withMessage('error in login');
export const loginValidationLength = body('login').isString().
                                                isLength({max:10, min:3}).
                                                withMessage('error in login length');
                                            
export const passwordValidation = body('password').trim().notEmpty().isString().
                                                  isLength({max: 20, min: 5}).
                                                  withMessage('error in password');

export const emailValidation = body('email').trim().notEmpty().
                                            matches(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/).
                                            withMessage('error in email');                                


