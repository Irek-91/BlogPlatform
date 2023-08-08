import { body, validationResult } from "express-validator";
import { userRepository } from "../repositories/users-db-repository";

export const loginValidation = body('login').trim().notEmpty().
                                            matches('^[a-zA-Z0-9_-]*$').
                                            withMessage('error in login').
                                            custom(async (login) => {

                                                const user = await userRepository.findUserByLogin(login);
                                              
                                                if(user){
                                                  throw new Error("User ")
                                                }
                                                return true
                                              })
export const loginValidationLength = body('login').isString().
                                                isLength({max:10, min:3}).
                                                withMessage('error in login length');
                                            
export const passwordValidation = body('password').trim().notEmpty().isString().
                                                  isLength({max: 20, min: 6}).
                                                  withMessage('error in password');

export const emailValidation = body('email').trim().notEmpty().
                                            matches(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/).
                                            withMessage('error in email')
                                                                          
export const emailValidationCustom = body('email').
                                            custom(async (email) => {

                                                const user = await userRepository.findUserByEmail(email);
                                              
                                                if(user){
                                                  throw new Error("User with this email not found")
                                                }
                                                return true
                                              }) 

