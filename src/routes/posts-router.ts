import { Request, Response, Router } from "express";
import { postType } from "../type";
import { postRepository } from "../repositories/post-repository";
import { body, validationResult } from "express-validator";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { blogsRepository } from "../repositories/blogs-repository";
import { blogIdValidation, contentValidation, shortDescriptionValidation, titleValidation } from "../midlewares/post-validation";
import { authMidleware } from "../midlewares/basicAuth";


export const postsRouter = Router ({});

postsRouter.get('/', (req: Request, res: Response) => {
    let posts = postRepository.findPost();
    res.send(posts)
  })
  
postsRouter.get('/:id', (req: Request, res: Response) => {
    let post = postRepository.getPostId(req.params.id)
    if (post) {
      res.send(post)
    } else {
      res.sendStatus(404)
    }
  })
  
postsRouter.delete('/:id', 
    authMidleware,
    (req: Request, res: Response) => {
    let post = postRepository.deletePostId(req.params.id);
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
  
  (req: Request, res: Response) => { 
   const title = req.body.title;
   const shortDescription = req.body.shortDescription;
   const content = req.body.content;
   const blogId = req.body.blogId;

  let post = postRepository.createdPostId(title, shortDescription, content, blogId)
  res.status(201).send(post)
  })
  
postsRouter.put('/:id',
    authMidleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    
    (req: Request, res: Response) => {
    const id = req.params.id;
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;


    let postResult = postRepository.updatePostId(id, title, shortDescription, content, blogId)
    if (postResult) {
      res.sendStatus(204);
      } else {
      res.sendStatus(404);
    }
  })