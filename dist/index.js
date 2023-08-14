"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const posts_router_1 = require("./routes/posts-router");
const blogs_router_1 = require("./routes/blogs-router");
const blogs_db_repository_1 = require("./repositories/blogs-db-repository");
const post_db_repository_1 = require("./repositories/post-db-repository");
const db_mongo_1 = require("./db/db-mongo");
const users_router_1 = require("./routes/users-router");
const auth_1 = require("./routes/auth");
const users_db_repository_1 = require("./repositories/users-db-repository");
const comments_router_1 = require("./routes/comments-router");
const comments_db_repository_1 = require("./repositories/comments-db-repository");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const tokens_db_repository_1 = require("./repositories/tokens-db-repository");
exports.app = (0, express_1.default)();
const port = 3001;
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.json());
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/users', users_router_1.usersRouter);
exports.app.use('/auth', auth_1.authRouter);
exports.app.use('/comments', comments_router_1.commentsRouter);
exports.app.delete('/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogs_db_repository_1.blogsRepository.deleteBlogAll();
    yield post_db_repository_1.postRepository.deletePostAll();
    yield users_db_repository_1.userRepository.deleteUserAll();
    yield comments_db_repository_1.commentsRepository.deleteCommentsAll();
    yield tokens_db_repository_1.tokensRepository.deleteTokensAll();
    res.sendStatus(204);
}));
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_mongo_1.runDb)();
    exports.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
startApp();
