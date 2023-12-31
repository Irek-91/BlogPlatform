"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsController = exports.postsController = exports.commentsController = exports.usersController = exports.authController = exports.securityDeviceController = exports.tokensService = exports.userRepository = exports.blogsRepository = exports.postRepository = void 0;
const auth_service_1 = require("./domain/auth-service");
const blogs_service_1 = require("./domain/blogs-service");
const comments_service_1 = require("./domain/comments-service");
const posts_service_1 = require("./domain/posts-service");
const users_service_1 = require("./domain/users-service");
const blogs_db_repository_1 = require("./repositories/blogs-db-repository");
const comments_db_repository_1 = require("./repositories/comments-db-repository");
const post_db_repository_1 = require("./repositories/post-db-repository");
const users_db_repository_1 = require("./repositories/users-db-repository");
const tokens_db_repository_1 = require("./repositories/tokens-db-repository");
const token_service_1 = require("./domain/token-service");
const securityDevice_service_1 = require("./domain/securityDevice_service");
const auth_controller_1 = require("./controllers/auth_controller");
const blogs_controller_1 = require("./controllers/blogs-controller");
const comments_controller_1 = require("./controllers/comments-controller");
const securityDevice_controller_1 = require("./controllers/securityDevice-controller");
const posts_controller_1 = require("./controllers/posts-controller");
const users_controller_1 = require("./controllers/users-controller");
exports.postRepository = new post_db_repository_1.PostRepository();
const postsService = new posts_service_1.PostsService(exports.postRepository);
exports.blogsRepository = new blogs_db_repository_1.BlogsRepository();
const blogsService = new blogs_service_1.BlogsService(exports.blogsRepository);
exports.userRepository = new users_db_repository_1.UserRepository();
const usersService = new users_service_1.UsersService(exports.userRepository);
const commentsRepository = new comments_db_repository_1.CommentsRepository();
const commentsService = new comments_service_1.CommentsService(exports.userRepository, commentsRepository);
const tokensRepository = new tokens_db_repository_1.TokensRepository();
exports.tokensService = new token_service_1.TokensService(tokensRepository);
const authService = new auth_service_1.AuthService(exports.userRepository);
const securityDeviceService = new securityDevice_service_1.SecurityDeviceService(tokensRepository);
exports.securityDeviceController = new securityDevice_controller_1.SecurityDeviceController(securityDeviceService);
exports.authController = new auth_controller_1.AuthController(usersService, exports.tokensService, authService);
exports.usersController = new users_controller_1.UsersController(usersService);
exports.commentsController = new comments_controller_1.CommentsController(commentsService);
exports.postsController = new posts_controller_1.PostsController(postsService, blogsService, commentsService);
exports.blogsController = new blogs_controller_1.BlogsController(blogsService, postsService);
