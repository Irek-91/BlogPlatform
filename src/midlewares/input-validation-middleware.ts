import { validationResult, ResultFactory, checkSchema, Result, ValidationError, ErrorFormatter } from 'express-validator';
import { Request, Response, NextFunction } from "express";





export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  /*const errorFormatter = (error.msg, error.location) => {
     return {message:  , field:  };
   };*/
  const errorFormatter = ({ msg, path }: any) => {
    return {
      message: msg,
      field: path
    }
  }
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    res.status(400).send({ errorsMessages: errors.array({ onlyFirstError: true }) })
  } else {
    next()

  }
}


