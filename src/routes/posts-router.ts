import { Request, Response, Router } from "express";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { blogIdValidation, contentCommentValidation, contentValidation, shortDescriptionValidation, titleValidation } from "../midlewares/post-validation";
import { authMidleware } from "../midlewares/basicAuth";
import { PostsService } from "../domain/posts-service";
import { getPaginationFromQuery } from "../midlewares/pagination";
import { authMiddleware } from "../midlewares/auth-middleware";
import { BlogsService } from "../domain/blogs-service";
import { CommentsService } from "../domain/comments-service";
import { jwtService } from "../application/jwt-service";


export const postsRouter = Router({});

class PostsController {
  private postsService : PostsService
  private blogsService : BlogsService
  private commentsService : CommentsService
  constructor () {
    this.postsService = new PostsService()
    this.blogsService = new BlogsService()
    this.commentsService = new CommentsService()
  }

  async getPosts (req: Request, res: Response) {

    const pagination = getPaginationFromQuery(req.query)
  
    const posts = await this.postsService.findPost(pagination);
    if (!posts) {
      res.sendStatus(404)
    } else {
    res.send(posts)
    }
  }
  async getPostId (req: Request, res: Response) {
    let post = await this.postsService.getPostId(req.params.id)
    if (post) {
      res.send(post)
    } else {
      res.sendStatus(404)
    }
  }

  async getCommentsBuPostId (req: Request, res: Response) {
    const accessToken = req.cookies.accessToken
    const userId = (jwtService.getUserIdByToken(accessToken)).toString()
    if (userId === null) {
        res.sendStatus(404)
    }
    const pagination = getPaginationFromQuery(req.query)
    const postId = req.params.postId
    const resultPostId = await this.postsService.getPostId(postId)
    if (resultPostId === false) {
      res.sendStatus(404)
    }
    else {
      const commentsPostId = await this.commentsService.findCommentsByPostId(postId, userId, pagination)
        if (commentsPostId !== null) {
          res.send(commentsPostId)
        }
        else {
          res.sendStatus(404)
        }
    } 
  }

  async createdPostId (req: Request, res: Response) {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;

    let post = await this.postsService.createdPostId(title, shortDescription, content, blogId)
    if (!post) {
      res.sendStatus(404)
      return
    }
    res.status(201).send(post)
  }

  async createdCommentPostId (req: Request, res: Response) {
    if (!req.user) { return res.sendStatus(404) }

    const postId = req.params.postId
    const userId = req.user._id.toString()
    const content = req.body.content
    const post = await this.postsService.getPostId(postId)

    if (post === false) {return res.sendStatus(404)}
    let comment = await this.commentsService.createdCommentPostId(postId, userId, content)
    if (comment === null) {
      res.sendStatus(404)
    }
    else {
      res.status(201).send(comment)
    }

  }

  async updatePostId (req: Request, res: Response) {
    const id = req.params.id;
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;


    let postResult = await this.postsService.updatePostId(id, title, shortDescription, content, blogId)
    if (postResult === true) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }

  async deletePostId (req: Request, res: Response) {
    let post = await this.postsService.deletePostId(req.params.id);
    if (post) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  }

}

const postsControllerInstance = new PostsController()

postsRouter.get('/', postsControllerInstance.getPosts.bind(postsControllerInstance))
postsRouter.get('/:id', postsControllerInstance.getPostId.bind(postsControllerInstance))
postsRouter.get('/:postId/comments', postsControllerInstance.getCommentsBuPostId.bind(postsControllerInstance))
postsRouter.post('/', authMidleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation,
  inputValidationMiddleware,
  postsControllerInstance.createdPostId.bind(postsControllerInstance)
)
postsRouter.post('/:postId/comments', authMiddleware, contentCommentValidation, inputValidationMiddleware,
  postsControllerInstance.createdCommentPostId.bind(postsControllerInstance)
)

postsRouter.put('/:id', authMidleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation,
  inputValidationMiddleware,
  postsControllerInstance.updatePostId.bind(postsControllerInstance)
)

postsRouter.delete('/:id',
  authMidleware,
  postsControllerInstance.deletePostId.bind(postsControllerInstance)
)










