import express, {Request, Response} from 'express'
import { postsRouter} from './routes/posts-router';
import { blogsRouter} from './routes/blogs-router';
import { blogsRepository } from './repositories/blogs-db-repository';
import { postRepository } from './repositories/post-db-repository';
import { runDb } from './db/db-mongo';
import { usersRouter } from './routes/users-router';
import { authRouter } from './routes/auth';
import { userRepository } from './repositories/users-db-repository';
import { commentsRouter } from './routes/comments-router';
import { commentsRepository } from './repositories/comments-db-repository';
import cookieParser from 'cookie-parser';
import { tokensRepository } from './repositories/tokens-db-repository';
import { securityDeviceRouter } from './routes/securityDevice-router';
import { IPAndURIModelClass, runDbMongoose } from './db/db-mongoos';


export const app = express()
const port = 3001

app.use(cookieParser())
app.set('trust proxy', true)

app.use(express.json())
app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/security', securityDeviceRouter)
app.delete('/testing/all-data', async (req: Request, res: Response) => {
  await blogsRepository.deleteBlogAll();
  await postRepository.deletePostAll();
  await userRepository.deleteUserAll();
  await commentsRepository.deleteCommentsAll();
  await tokensRepository.deleteTokensAll();
  await IPAndURIModelClass.deleteMany({})
  res.sendStatus(204)
})

const startApp = async () => {
  await runDbMongoose()
  app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}

startApp()