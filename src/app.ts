import cookieParser from "cookie-parser"
import express, {Request, Response} from "express"
import { BlogsModelClass, PostsModelClass, UsersModelClass, CommentsModelClass, LikesModelClass, DevicesModelClass, IPAndURIModelClass } from "./db/db-mongoos"
import { authRouter } from "./routes/auth"
import { blogsRouter } from "./routes/blogs-router"
import { commentsRouter } from "./routes/comments-router"
import { postsRouter } from "./routes/posts-router"
import { securityDeviceRouter } from "./routes/securityDevice-router"
import { usersRouter } from "./routes/users-router"

export const app = express()


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