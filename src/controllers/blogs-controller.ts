import { PostsService } from '../domain/posts-service';
import { BlogsService } from '../domain/blogs-service';
import { Request, Response, Router } from "express";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { descriptionValidation, nameValidation, websiteUrl, websiteUrlLength } from "../midlewares/blogs-validation";
import { authMidleware } from "../midlewares/basicAuth";
import { blogIdValidation, contentValidation, shortDescriptionValidation, titleValidation } from "../midlewares/post-validation";
import { getPaginationFromQuery } from "../midlewares/pagination";
import { blogsController } from '../composition-root';



export class BlogsController {

  constructor(protected blogsService : BlogsService, protected postsService: PostsService) {
  }

  async getBlogs(req: Request, res: Response) {
    const pagination = getPaginationFromQuery(req.query)
    const foundBlogs = await this.blogsService.findBlogs(pagination);
    res.send(foundBlogs)
  }

  async getBlogId(req: Request, res: Response) {
    let BlogId = await this.blogsService.getBlogId(req.params.id)
    if (BlogId) {
      res.send(BlogId)
    } else {
      res.sendStatus(404)
    }
  }

  async getPostsByBlogId(req: Request, res: Response) {
    const blogId = req.params.blogId
    const pagination = getPaginationFromQuery(req.query)

    const blog = await this.blogsService.getBlogId(blogId)
    if (!blog) return res.sendStatus(404)

    const foundBlogs = await this.postsService.findPostsBlogId(pagination, blogId);

    if (foundBlogs) {
      res.send(foundBlogs)
    } else {
      res.sendStatus(404)
    }
  }

  async deletBlogId(req: Request, res: Response) {
    let blogId = await this.blogsService.deleteBlogId(req.params.id)
    if (blogId) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  }

  async updateBlogId(req: Request, res: Response) {
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;
    let blogId = await this.blogsService.updateBlog(name, description, websiteUrl, id)
    if (!blogId) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  }

  async createBlog(req: Request, res: Response) {
    const nameBlog = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;

    const newBlog = await this.blogsService.createBlog(nameBlog, description, websiteUrl);

    res.status(201).send(newBlog)
  }

  async createPostByBlog(req: Request, res: Response) {
    const title: string = req.body.title;
    const shortDescription: string = req.body.shortDescription;
    const content: string = req.body.content;
    const blogId: string = req.params.blogId
    const blogName = await this.blogsService.getBlogNameById(blogId)
    const newPost = await this.postsService.createdPostBlogId(title, shortDescription, content, blogId, blogName);
    if (newPost != false) {
      res.status(201).send(newPost)
    } else {
      res.sendStatus(404)
    }
  }
}

