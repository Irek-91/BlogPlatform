import { Request, Response, Router } from "express";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { blogIdValidation, contentValidation, shortDescriptionValidation, titleValidation } from "../midlewares/post-validation";
import { authMidleware } from "../midlewares/basicAuth";
import { postsService } from "../domain/posts-service";
import { getPaginationFromQuery } from "../midlewares/pagination";


export const postsRouter = Router ({});

postsRouter.get('/', async (req: Request, res: Response) => {
    
    const pagination = getPaginationFromQuery(req.query)

    const posts = await postsService.findPost(pagination);
    res.send(posts)
  })
  
postsRouter.get('/:id',async (req: Request, res: Response) => {
    let post = await postsService.getPostId(req.params.id)
    if (post) {
      res.send(post)
    } else {
      res.sendStatus(404)
    }
  })
  
postsRouter.delete('/:id', 
    authMidleware,
    async (req: Request, res: Response) => {
    let post = await postsService.deletePostId(req.params.id);
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
  
  async (req: Request, res: Response) => { 
   const title = req.body.title;
   const shortDescription = req.body.shortDescription;
   const content = req.body.content;
   const blogId = req.body.blogId;

  let post = await postsService.createdPostId(title, shortDescription, content, blogId)
  res.status(201).send(post)
  })
  
postsRouter.put('/:id',
    authMidleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    
    async (req: Request, res: Response) => {
    const id = req.params.id;
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;


    let postResult = await postsService.updatePostId(id, title, shortDescription, content, blogId)
    if (postResult === true) {
      res.sendStatus(204);
      } else {
      res.sendStatus(404);
    }
  })

  /*postsRouter.delete('/testing/all-data', 
    async (req: Request, res: Response) => {
      res.sendStatus(204)
  })*/