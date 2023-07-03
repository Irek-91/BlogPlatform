import { Request, Response, Router } from "express";
import { blogsRepository } from "../repositories/blogs-repository";
import { body, validationResult } from "express-validator";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { descriptionValidation, nameValidation, websiteUrl, websiteUrlLength } from "../midlewares/blogs-validation";
import { authMidleware } from "../midlewares/basicAuth";


export const blogsRouter = Router ({})


blogsRouter.get('/', 
  
  (req: Request, res: Response) => {
  let foundBlogs = blogsRepository.findBlogs();
  res.send(foundBlogs)
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
  let BlogId = blogsRepository.getBlogId(req.params.id)
  if (BlogId) {
      res.send(BlogId)
    } else {  
    res.sendStatus(404)
    }
})
  
blogsRouter.delete('/:id', 
    authMidleware, 
    (req: Request, res: Response) => {
    let blogId = blogsRepository.deleteBlogId(req.params.id)
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

  (req: Request, res: Response) => {
  const id = req.params.id;
  const name = req.body.name;
  const description = req.body.description;
  const websiteUrl = req.body.websiteUrl;  
  let blogId = blogsRepository.updateBlog(name, description, websiteUrl, id)
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

    (req: Request, res: Response) => {
    const nameBlog = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;

    const newBlog = blogsRepository.createBlog(nameBlog, description, websiteUrl);
  
    res.status(201).send(newBlog)
    
  })