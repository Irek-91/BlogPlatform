import { validationResult, ResultFactory, checkSchema, Result, ValidationError} from 'express-validator';
import { Request, Response, NextFunction} from "express";





export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
   /*const errorFormatter = (error.msg, error.location) => {
      return {message:  , field:  };
    };*/
    const errorFormatter = ({msg, type} : ValidationError) => {
      return {
          message: msg,
          field: type
      }
  }
   const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).json({errorsMessages: errors.array({ onlyFirstError: true})})
     } else {
      next()
     }
}


