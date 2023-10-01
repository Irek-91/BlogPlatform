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
const users_router_1 = require("./routes/users-router");
const auth_1 = require("./routes/auth");
const comments_router_1 = require("./routes/comments-router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const securityDevice_router_1 = require("./routes/securityDevice-router");
const db_mongoos_1 = require("./db/db-mongoos");
exports.app = (0, express_1.default)();
const port = 3001;
exports.app.use((0, cookie_parser_1.default)());
exports.app.set('trust proxy', true);
exports.app.use(express_1.default.json());
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/users', users_router_1.usersRouter);
exports.app.use('/auth', auth_1.authRouter);
exports.app.use('/comments', comments_router_1.commentsRouter);
exports.app.use('/security', securityDevice_router_1.securityDeviceRouter);
exports.app.delete('/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_mongoos_1.BlogsModelClass.deleteMany();
    yield db_mongoos_1.PostsModelClass.deleteMany();
    yield db_mongoos_1.UsersModelClass.deleteMany();
    yield db_mongoos_1.CommentsModelClass.deleteMany();
    yield db_mongoos_1.LikesModelClass.deleteMany();
    yield db_mongoos_1.DevicesModelClass.deleteMany();
    yield db_mongoos_1.IPAndURIModelClass.deleteMany();
    res.sendStatus(204);
}));
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_mongoos_1.runDbMongoose)();
    exports.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
startApp();
