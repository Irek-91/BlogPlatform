import { Request, Response, Router } from "express";
import { postType } from "../type";
import { postRepository } from "../repositories/post-repository";
import { body, validationResult } from "express-validator";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";


export const postsRouter = Router ({});

const titleValidation = body('title').trim().notEmpty().isString().isLength({max: 30}).withMessage('error in string length');
const shortDescriptionValidation = body('shortDescription').trim().notEmpty().isLength({max: 100}).withMessage('error in shortDescription length');
const contentValidation = body('content').trim().notEmpty().isString().isLength({max: 1000}).withMessage("error in content length");
const blogIdValidation = body('blogId').trim().notEmpty().isString().withMessage("error in the content");
 

postsRouter.get('/', (req: Request, res: Response) => {
    let posts = postRepository.findPost();
    res.send(posts)
  })
  
postsRouter.get('/:id', (req: Request, res: Response) => {
    let post = postRepository.getPostId(+req.params.id)
    if (post) {
      res.send(post)
    } else {
      res.sendStatus(404)
    }
  })
  
postsRouter.delete('/:id', (req: Request, res: Response) => {
    let post = postRepository.deletePostId(+req.params.id);
    if (post === true) {  
        res.sendStatus(204)
        return;
      } else {
        res.sendStatus(404)
      }
})
  
postsRouter.delete('/testing/all-data', (req: Request, res: Response) => {
  let result = postRepository.deletePostAll();
  if (result === true) {
    res.sendStatus(204)
  }
}) 
  
postsRouter.post('/', 
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
   
      /*
   if (!title || typeof title !== 'string' || title.length > 30) {
    apiErrorResult.push({message: 'string title length >30', field: "title"})
  }
  
  if (!shortDescription || typeof shortDescription !== 'string' || shortDescription.length > 100) {
    apiErrorResult.push({message: 'string shortDescription length > 100', field: "shortDescription"})
  }
  
  if (!content || typeof content !== 'string' || content.length > 1000) {
    apiErrorResult.push({message: 'string content length > 1000', field: "content"})
  }
  
  if (!blogId || typeof blogId !== 'string') {
    apiErrorResult.push({message: 'string', field: "blogId"})
  }
  
  if (apiErrorResult.length !== 0) {
    res.status(400).send({ errorsMessages: apiErrorResult})
    return;
  }
  */
  let post = postRepository.createdPostId(title, shortDescription, content, blogId)
  res.status(201).send(post)
  })
  
postsRouter.put('/:id',
    
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    
    (req: Request, res: Response) => {
    const id = +req.params.id;
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;


    let postResult = postRepository.updatePostId(id, title, shortDescription, content, blogId)
    if (postResult === true) {
      res.sendStatus(204);
      } else {
      res.sendStatus(404);
    }
  })