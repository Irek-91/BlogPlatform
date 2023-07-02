import { Request, Response, Router } from "express";
import { blogsRepository } from "../repositories/blogs-repository";
import { body, validationResult } from "express-validator";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";


export const blogsRouter = Router ({})

const nameValidation = body('name').trim().notEmpty().isString().isLength({max: 15}).withMessage('error in name length');
const descriptionValidation = body('description').trim().notEmpty().isLength({max: 500}).withMessage('error in description length');
const websiteUrl = body('websiteUrl').trim().notEmpty().
isURL({
  protocols: [
      'http',
      'https',
      'ftp'
  ]
  //host_whitelist: (('^https://([a-zA-Z0-9_-]'+'\.)'+'[a-zA-Z0-9_-]'+'(\/[a-zA-Z0-9_-]'+')*\/?$'))
}).withMessage("error in the websiteUrl, not pattern");
const websiteUrlLength = body('websiteUrl').isString().isLength({max: 100}).withMessage("error in websiteUrl length");
 


blogsRouter.get('/', (req: Request, res: Response) => {
  let foundBlogs = blogsRepository.findBlogs();
  res.send(foundBlogs)
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
  let BlogId = blogsRepository.getBlogId(+req.params.id)
  if (BlogId) {
      res.send(BlogId)
    } else {  
    res.sendStatus(404)
    }
})
  
blogsRouter.delete('/:id', (req: Request, res: Response) => {
    let blogId = blogsRepository.deleteBlogId(+req.params.id)
    if (blogId === true) {
      res.sendStatus(204)
      return;
    } else {
      res.sendStatus(404)
    }
})  



blogsRouter.put('/:id',
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
  let blogId = blogsRepository.updateBlog(name, description, websiteUrl, +id)
    if (blogId === false) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  })

blogsRouter.post('/', 
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
    
    if (newBlog) {
    res.status(201).send(newBlog)
    } else {
      res.status(400).send(newBlog)
    }
    
  })