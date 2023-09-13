import { log } from 'console';
import { Request, Response, NextFunction } from 'express';

export const likeStatusValidation = async (req: Request, res: Response, next: NextFunction) => {
  const likeStatus = req.body.likeStatus
  if (typeof likeStatus !== 'string' || likeStatus !== ('Like' || 'None' || 'Dislike')) {
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

