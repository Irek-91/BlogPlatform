import express, {Request, Response} from 'express'
import { postsRouter} from './routes/posts-router';
import { blogsRouter} from './routes/blogs-router';
import { blogsRepository } from './repositories/blogs-in-memory-repository';
import { postRepository } from './repositories/post-in-memory-repository';
import { runDb } from './db/db-mongo';

const app = express()
const port = 3001


app.use(express.json())

app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)

/*app.delete('/testing/all-data', async (req: Request, res: Response) => {
  await blogsRepository.deleteBlogAll();
  await postRepository.deletePostAll();

  res.sendStatus(204)
})
*/ 

const startApp = async () => {
  await runDb()
  app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}
startApp()