import { Request, Response, Router } from "express";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { blogIdValidation, contentCommentValidation, contentValidation, shortDescriptionValidation, titleValidation } from "../midlewares/post-validation";
import { authMidleware } from "../midlewares/basicAuth";
import { postsService } from "../domain/posts-service";
import { getPaginationFromQuery } from "../midlewares/pagination";
import { authMiddleware } from "../midlewares/auth-middleware";
import { commentsService } from "../domain/comments-service";


export const postsRouter = Router({});

postsRouter.get('/', async (req: Request, res: Response) => {

  const pagination = getPaginationFromQuery(req.query)

  const posts = await postsService.findPost(pagination);
  res.send(posts)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
  let post = await postsService.getPostId(req.params.id)
  if (post) {
    res.send(post)
  } else {
    res.sendStatus(404)
  }
})

postsRouter.delete('/:id',
  authMidleware,
  async (req: Request, res: Response) => {
    let post = await postsService.deletePostId(req.params.id);
    if (post) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  })

postsRouter.post('/',
  authMidleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
  inputValidationMiddleware,

  async (req: Request, res: Response) => {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;

    let post = await postsService.createdPostId(title, shortDescription, content, blogId)
    res.status(201).send(post)
  })

postsRouter.put('/:id',
  authMidleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
  inputValidationMiddleware,

  async (req: Request, res: Response) => {
    const id = req.params.id;
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;


    let postResult = await postsService.updatePostId(id, title, shortDescription, content, blogId)
    if (postResult === true) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  })


postsRouter.get('/:postId/comments', async (req: Request, res: Response) => {

  const pagination = getPaginationFromQuery(req.query)
  const postId = req.params.getPostId
  const resultPostId = await postsService.getPostId(postId)
  if (resultPostId === false) {
    res.sendStatus(404)
  }
  else if (resultPostId) {

  const commentsPostId = await commentsService.findCommentsByPostId(postId, pagination)

  if (commentsPostId !== null) {
    res.send(commentsPostId)
  }
  else {
    res.sendStatus(404)
  }
}

})



postsRouter.post('/:postId/comments',
  authMiddleware,
  contentCommentValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    if (!req.user) { return res.sendStatus(404) }

    const postId = req.params.postId
    const userId = req.user._id.toString()
    const content = req.body.content
    const post = await postsService.getPostId(postId)

    if (post === false) {return res.sendStatus(404)}
    let comment = await commentsService.createdCommentPostId(postId, userId, content)
    if (comment === null) {
      res.sendStatus(404)
    }
    else {
      res.status(203).send(comment)
    }

  })