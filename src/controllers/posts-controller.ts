import { Request, Response, Router } from "express";
import { PostsService } from "../domain/posts-service";
import { getPaginationFromQuery } from "../midlewares/pagination";
import { BlogsService } from "../domain/blogs-service";
import { CommentsService } from "../domain/comments-service";

export class PostsController {
  constructor(protected postsService: PostsService,  protected blogsService: BlogsService, protected commentsService: CommentsService) { }

  async getPosts(req: Request, res: Response) {

    const pagination = getPaginationFromQuery(req.query)
    const { userId } = req

    const posts = await this.postsService.findPost(pagination, userId);
    if (!posts) {
      res.sendStatus(404)
    } else {
      res.send(posts)
    }
  }
  async getPostId(req: Request, res: Response) {
    const { userId } = req

    let post = await this.postsService.getPostId(req.params.id, userId)
    if (post) {
      res.send(post)
    } else {
      res.sendStatus(404)
    }
  }

  async getCommentsBuPostId(req: Request, res: Response) {
    const { userId } = req
    const pagination = getPaginationFromQuery(req.query)
    const postId = req.params.postId
    const resultPostId = await this.postsService.getPostId(postId, userId)
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

  async createdPostId(req: Request, res: Response) {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;
    const blogName = await this.blogsService.getBlogNameById(blogId)
    let post = await this.postsService.createdPostBlogId(title, shortDescription, content, blogId, blogName)
    if (!post) {
      res.sendStatus(404)
      return
    }
    res.status(201).send(post)
  }

  async createdCommentPostId(req: Request, res: Response) {
    if (!req.user) { return res.sendStatus(404) }

    const postId = req.params.postId
    const userId = req.user._id.toString()
    const content = req.body.content
    const post = await this.postsService.getPostId(postId, userId)

    if (post === false) { return res.sendStatus(404) }
    let comment = await this.commentsService.createdCommentPostId(postId, userId, content)
    if (comment === null) {
      res.sendStatus(404)
    }
    else {
      res.status(201).send(comment)
    }

  }

  async updatePostId(req: Request, res: Response) {
    const id = req.params.id;
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;


    let postResult = await this.postsService.updatePostId(id, title, shortDescription, content, blogId)
    if (postResult) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }

  async updateLikeStatusPostId(req: Request, res: Response) {
    if (!req.user) { return res.sendStatus(404) }
    const postId = req.params.postId;
    const userId = req.user!._id.toString()
    const likeStatus = req.body.likeStatus
    const resultUpdateLikeStatusPost = await this.postsService.updateLikeStatusPostId(postId, userId, likeStatus)
    if (resultUpdateLikeStatusPost) {
      return res.sendStatus(204)
    }
    else {
      res.sendStatus(404)
    }
  }

  async deletePostId(req: Request, res: Response) {
    let post = await this.postsService.deletePostId(req.params.id);
    if (post) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  }
}









