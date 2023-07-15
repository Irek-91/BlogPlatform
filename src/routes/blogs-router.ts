import { Request, Response, Router } from "express";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { descriptionValidation, nameValidation, websiteUrl, websiteUrlLength } from "../midlewares/blogs-validation";
import { authMidleware } from "../midlewares/basicAuth";
import { blogsService } from "../domain/blogs-service";
import { postsService } from "../domain/posts-service";
import { contentValidation, shortDescriptionValidation, titleValidation } from "../midlewares/post-validation";


export const blogsRouter = Router ({})

blogsRouter.get('/', 
  
  async (req: Request, res: Response) => {
  const searchNameTerm: string = req.body.searchNameTerm || null;
  const sortBy: string = req.body.sortBy || "createdAt";
  let sortDirection: 1 | -1 = -1;
  const pageNumber: number = +req.body.pageNumber || 1;
  const pageSize: number = +req.body.pageSize || 10;

  const foundBlogs = await blogsService.findBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize);
  res.send(foundBlogs)
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
  let BlogId = await blogsService.getBlogId(req.params.id)
  if (BlogId) {
      res.send(BlogId)
    } else {  
    res.sendStatus(404)
    }
})


blogsRouter.get('/:blogId/posts', async (req: Request, res: Response) => {
  const sortBy: string = req.body.sortBy || "createdAt";;
  let sortDirection: 1 | -1 = 1;
  const pageNumber: number = +req.body.pageNumber || 1;
  const pageSize: number = +req.body.pageSize || 10;
  if (req.body.sortDirection === "asc") {sortDirection = 1} else {sortDirection = -1}
  const blogId : string = req.params.blogId;

  let BlogId = await blogsService.getBlogId(req.params.id)
  if (BlogId) {
    const foundBlogs = await postsService.findPostsBlogId(pageNumber, pageSize,sortBy, sortDirection, blogId);

    if (foundBlogs === false) {
      res.sendStatus(404)
    } else {
      res.send(foundBlogs)
    }

  } else {  
    res.sendStatus(404)
  }
})

blogsRouter.delete('/:id', 
    authMidleware, 
    async (req: Request, res: Response) => {
    let blogId = await blogsService.deleteBlogId(req.params.id)
    if (blogId) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
})  

blogsRouter.put('/:id',
    authMidleware,
    nameValidation,
    descriptionValidation,
    websiteUrl,
    websiteUrlLength,
    inputValidationMiddleware,

  async (req: Request, res: Response) => {
  const id = req.params.id;
  const name = req.body.name;
  const description = req.body.description;
  const websiteUrl = req.body.websiteUrl;  
  let blogId = await blogsService.updateBlog(name, description, websiteUrl, id)
    if (!blogId) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  })

blogsRouter.post('/', 
    authMidleware,
    nameValidation,
    descriptionValidation,
    websiteUrl,
    websiteUrlLength,
    inputValidationMiddleware,

    async (req: Request, res: Response) => {
    const nameBlog = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;

    const newBlog = await blogsService.createBlog(nameBlog, description, websiteUrl);
  
    res.status(201).send(newBlog)
    
  })
  
  blogsRouter.post('/:blogId/posts', 
    authMidleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,

    async (req: Request, res: Response) => {
    const title:string = req.body.title;
    const shortDescription:string = req.body.shortDescription;
    const content: string = req.body.content;
    const blogId:string = req.params.blogId
    const newBlog = await postsService.createdPostBlogId(title, shortDescription, content, blogId);
    if (newBlog != null) {
      res.status(201).send(newBlog)
      } else {  
    res.sendStatus(404)
    }
  })
  

/*blogsRouter.delete('/testing/all-data', async (req: Request, res: Response) => {
    await blogsRepository.deleteBlogAll();  
    res.sendStatus(204)
  })*/