import { Request, Response, Router } from "express";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { blogIdValidation, contentValidation, shortDescriptionValidation, titleValidation } from "../midlewares/post-validation";
import { authMidleware } from "../midlewares/basicAuth";
import { postsService } from "../domain/posts-service";


export const postsRouter = Router ({});

postsRouter.get('/', async (req: Request, res: Response) => {
    const pageNumber : number = +req.body.pageNumber || 1;
    const pageSize: number = +req.body.pageSize || 10;
    const sortBy: string = req.body.sortBy;
    let sortDirection: 1 |-1 = 1;
    if (req.body.sortDirection === "asc") {sortDirection = 1} else {sortDirection = -1}

    const posts = await postsService.findPost(pageNumber, pageSize, sortBy, sortDirection);
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