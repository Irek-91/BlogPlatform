import { getUserMiddleware } from './../midlewares/get-comments-middleware ';
import { Request, Response, Router } from "express";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { blogIdValidation, contentCommentValidation, contentValidation, shortDescriptionValidation, titleValidation } from "../midlewares/post-validation";
import { authMidleware } from "../midlewares/basicAuth";
import { PostsService } from "../domain/posts-service";
import { getPaginationFromQuery } from "../midlewares/pagination";
import { authMiddleware } from "../midlewares/auth-middleware";
import { BlogsService } from "../domain/blogs-service";
import { CommentsService } from "../domain/comments-service";
import { likeStatusValidation1 } from '../midlewares/like_status_validation';
import { postsController } from '../composition-root';


export const postsRouter = Router({});

postsRouter.get('/', getUserMiddleware, postsController.getPosts.bind(postsController))
postsRouter.get('/:id', getUserMiddleware, postsController.getPostId.bind(postsController))
postsRouter.get('/:postId/comments', getUserMiddleware, postsController.getCommentsBuPostId.bind(postsController))
postsRouter.post('/', authMidleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation,
  inputValidationMiddleware,
  postsController.createdPostId.bind(postsController)
)

postsRouter.post('/:postId/comments', authMiddleware, contentCommentValidation, inputValidationMiddleware,
  postsController.createdCommentPostId.bind(postsController)
)

postsRouter.put('/:id', authMidleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation,
  inputValidationMiddleware,
  postsController.updatePostId.bind(postsController)
)

postsRouter.put('/:postId/like-status', authMiddleware, likeStatusValidation1, postsController.updateLikeStatusPostId.bind(postsController))

postsRouter.delete('/:id',
  authMidleware,
  postsController.deletePostId.bind(postsController)
)










