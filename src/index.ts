import express, {Request, Response} from 'express'
import { postType } from './type';
import { postsRouter} from './routes/posts-router';
import { blogsRouter} from './routes/blogs-router';

const app = express()
const port = 3000

app.use(express.json())

app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)



/*app.delete('/testing/all-data', (req: Request, res: Response) => {
  blogs.splice(-1, 0);
  posts.splice(-1, 0);
  res.sendStatus(204)
})
*/

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})