import { Request, Response, NextFunction } from 'express';

export const likeStatusValidation = async (req: Request, res: Response, next: NextFunction) => {
  const likeStatus = req.body.likeStatus
  if (likeStatus !=='None' || likeStatus !=='Like' || likeStatus !=='Dislike') {
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

