import { Request, Response, Router } from "express";
import { blogsRepository } from "../repositories/blogs-db-repository";
import { body, validationResult } from "express-validator";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { descriptionValidation, nameValidation, websiteUrl, websiteUrlLength } from "../midlewares/blogs-validation";
import { authMidleware } from "../midlewares/basicAuth";


export const blogsRouter = Router ({})


blogsRouter.get('/', 
  
  async (req: Request, res: Response) => {
  let foundBlogs = await blogsRepository.findBlogs();
  res.send(foundBlogs)
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
  let BlogId = await blogsRepository.getBlogId(req.params.id)
  if (BlogId) {
      res.send(BlogId)
    } else {  
    res.sendStatus(404)
    }
})
  
blogsRouter.delete('/:id', 
    authMidleware, 
    async (req: Request, res: Response) => {
    let blogId = await blogsRepository.deleteBlogId(req.params.id)
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
  let blogId = await blogsRepository.updateBlog(name, description, websiteUrl, id)
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

    const newBlog = await blogsRepository.createBlog(nameBlog, description, websiteUrl);
  
    res.status(201).send(newBlog)
    
  })

/*blogsRouter.delete('/testing/all-data', async (req: Request, res: Response) => {
    await blogsRepository.deleteBlogAll();  
    res.sendStatus(204)
  })*/