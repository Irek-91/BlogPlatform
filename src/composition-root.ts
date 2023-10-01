import { AuthService } from './domain/auth-service';
import { UsersController } from './routes/users-router';
import { BlogsService } from "./domain/blogs-service";
import { CommentsService } from "./domain/comments-service";
import { PostsService } from "./domain/posts-service";
import { UsersService } from "./domain/users-service";
import { BlogsRepository } from "./repositories/blogs-db-repository";
import { CommentsRepository } from "./repositories/comments-db-repository";
import { PostRepository } from "./repositories/post-db-repository";
import { UserRepository } from "./repositories/users-db-repository";
import { BlogsController } from "./routes/blogs-router";
import { CommentsController } from "./routes/comments-router";
import { PostsController } from "./routes/posts-router";
import { AuthController } from './routes/auth';
import { TokensRepository } from './repositories/tokens-db-repository';
import { TokensService } from './domain/token-service';
import { SecurityDeviceController } from './routes/securityDevice-router';
import { SecurityDeviceService } from './domain/securityDevice_service';



export const postRepository = new PostRepository()
const postsService = new PostsService(postRepository)

export const blogsRepository = new BlogsRepository()
const blogsService = new BlogsService(blogsRepository)

export const userRepository = new UserRepository()
const usersService = new UsersService(userRepository)

const commentsRepository = new CommentsRepository()
const commentsService = new CommentsService(userRepository, commentsRepository)

const tokensRepository = new TokensRepository()
export const tokensService = new TokensService(tokensRepository)

const authService = new AuthService(userRepository)
const securityDeviceService = new SecurityDeviceService(tokensRepository)


export const securityDeviceController = new SecurityDeviceController(securityDeviceService)
export const authController = new AuthController(usersService, tokensService, authService)
export const usersController = new UsersController(usersService)
export const commentsController = new CommentsController(commentsService) 
export const postsController = new PostsController (postsService, blogsService, commentsService)

export const blogsController = new BlogsController (blogsService, postsService)