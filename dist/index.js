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
const express_1 = __importDefault(require("express"));
const posts_router_1 = require("./routes/posts-router");
const blogs_router_1 = require("./routes/blogs-router");
const blogs_db_repository_1 = require("./repositories/blogs-db-repository");
const post_db_repository_1 = require("./repositories/post-db-repository");
const db_mongo_1 = require("./db/db-mongo");
const users_router_1 = require("./routes/users-router");
const auth_1 = require("./routes/auth");
const app = (0, express_1.default)();
const port = 3001;
app.use(express_1.default.json());
app.use('/posts', posts_router_1.postsRouter);
app.use('/blogs', blogs_router_1.blogsRouter);
app.use('/users', users_router_1.usersRouter);
app.use('/auth/login', auth_1.authRouter);
app.delete('/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogs_db_repository_1.blogsRepository.deleteBlogAll();
    yield post_db_repository_1.postRepository.deletePostAll();
    res.sendStatus(204);
}));
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_mongo_1.runDb)();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
startApp();
