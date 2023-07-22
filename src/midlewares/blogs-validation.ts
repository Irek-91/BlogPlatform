import { body } from "express-validator";


export const nameValidation = body('name').trim().notEmpty().
                                          isString().isLength({max: 15})
                                          .withMessage('error in name length');
export const descriptionValidation = body('description').trim().notEmpty().
                                                        isLength({max: 500}).withMessage('error in description length');
                                                        
export const websiteUrl = body('websiteUrl').trim().
                                            notEmpty().
                                            matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$').
                                            withMessage("error in the websiteUrl, not pattern");
export const websiteUrlLength = body('websiteUrl').isString().
                                                  isLength({max: 100}).
                                                  withMessage("error in websiteUrl length");
