import { Request, Response, Router } from "express";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { descriptionValidation, nameValidation, websiteUrl, websiteUrlLength } from "../midlewares/blogs-validation";
import { authMidleware } from "../midlewares/basicAuth";
import { blogIdParamsExists, blogIdValidation, contentValidation, shortDescriptionValidation, titleValidation } from "../midlewares/post-validation";
import { blogsController } from '../composition-root';


export const blogsRouter = Router({})

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))
blogsRouter.get('/:id', blogsController.getBlogId.bind(blogsController))
blogsRouter.get('/:blogId/posts', blogsController.getPostsByBlogId.bind(blogsController))
blogsRouter.delete('/:id', authMidleware, blogsController.deletBlogId.bind(blogsController))
blogsRouter.post('/', authMidleware, nameValidation, descriptionValidation, websiteUrl, websiteUrlLength,
  inputValidationMiddleware,
  blogsController.createBlog.bind(blogsController)
)
blogsRouter.post('/:blogId/posts', authMidleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdParamsExists,
  inputValidationMiddleware,
  blogsController.createPostByBlog.bind(blogsController)
)

blogsRouter.put('/:id', authMidleware, nameValidation, descriptionValidation, websiteUrl, websiteUrlLength,
  inputValidationMiddleware,
  blogsController.updateBlogId.bind(blogsController)
)
