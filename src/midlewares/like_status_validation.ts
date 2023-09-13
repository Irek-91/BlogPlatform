import { body } from "express-validator";
import { Request, Response, NextFunction } from 'express';

export const likeStatusValidation = async (req: Request, res: Response, next: NextFunction) => {
  const likeStatus = req.body.likeStatus
  if (typeof likeStatus !== 'string' || likeStatus !== ('Dislike' || 'None' || 'Like')) {
    res.status(400).send(
      { errorsMessages: [{
                          message: 'error in likeStatus', 
                          field: "likeStatus" 
        }]
      }
    )  
  }
  else {
    next()
  }
}
export const likeStatusValidation1 = body('likeStatus').trim().notEmpty().
                                            matches(/'Like'|'None'|'Dislike'/).
                                            withMessage('error in likeStatus')
