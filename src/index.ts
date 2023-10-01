import express, { Request, Response } from 'express'
import { postsRouter } from './routes/posts-router';
import { blogsRouter } from './routes/blogs-router';
import { runDb } from './db/db-mongo';
import { usersRouter } from './routes/users-router';
import { authRouter } from './routes/auth';
import { commentsRouter } from './routes/comments-router';
import cookieParser from 'cookie-parser';
import { securityDeviceRouter } from './routes/securityDevice-router';
import { BlogsModelClass, CommentsModelClass, DevicesModelClass, IPAndURIModelClass, LikesModelClass, PostsModelClass, UsersModelClass, runDbMongoose } from './db/db-mongoos';

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
  await BlogsModelClass.deleteMany();
  await PostsModelClass.deleteMany();
  await UsersModelClass.deleteMany();
  await CommentsModelClass.deleteMany();
  await LikesModelClass.deleteMany();
  await DevicesModelClass.deleteMany();
  await IPAndURIModelClass.deleteMany();
  res.sendStatus(204)
})

const startApp = async () => {
  await runDbMongoose()
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

startApp()