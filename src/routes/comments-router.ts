import { contentCommentValidation } from './../midlewares/post-validation';
import { Request, Response, Router } from "express";
import { authMiddleware } from "../midlewares/auth-middleware";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { likeStatusValidation, likeStatusValidation1 } from '../midlewares/like_status_validation';
import { getUserMiddleware } from '../midlewares/get-comments-middleware ';
import { commentsController } from '../composition-root';

export const commentsRouter = Router({})

commentsRouter.get('/:id', getUserMiddleware, commentsController.findCommentById.bind(commentsController))
commentsRouter.put('/:commentsId', authMiddleware, contentCommentValidation, inputValidationMiddleware,
    commentsController.updateCommentId.bind(commentsController))
commentsRouter.put('/:commentsId/like-status', authMiddleware, likeStatusValidation1, inputValidationMiddleware,
    commentsController.updateStatusByCommentId.bind(commentsController))


commentsRouter.delete('/:commentsId', authMiddleware, commentsController.deleteCommentById.bind(commentsController))

