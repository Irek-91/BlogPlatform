import { body } from "express-validator";
import { Request, Response, NextFunction } from 'express';

export const likeStatusValidation = async (req: Request, res: Response, next: NextFunction) => {
  const likeStatus = req.body.likeStatus
  if (typeof likeStatus !== 'string' || likeStatus !== (LikeStatusEnum.Dislike || LikeStatusEnum.None || LikeStatusEnum.Like)) {
    res.status(400).send(
      {
        errorsMessages: [{
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

export enum LikeStatusEnum {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None'
}

export const LikeStatusValues = Object.values(LikeStatusEnum)

export const likeStatusValidation1 = body('likeStatus').isString().trim().notEmpty().withMessage('error in likeStatus').
  // matches(/'Like'|'None'|'Dislike'/).
  custom((val) => {
    if (!LikeStatusValues.includes(val)) {
      throw new Error('invalid input data')
    }
    return true
  })
  
