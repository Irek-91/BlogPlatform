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
exports.connectDisconnectDb = exports.runDbMongoose = exports.IPAndURIModelClass = exports.DevicesModelClass = exports.LikesPostsClass = exports.LikesModelClass = exports.CommentsModelClass = exports.UsersModelClass = exports.PostsModelClass = exports.BlogsModelClass = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const types_blogs_1 = require("../types/types-blogs");
const types_posts_1 = require("../types/types-posts");
const user_1 = require("../types/user");
const mongoosShema_1 = require("./mongoosShema");
dotenv_1.default.config();
let dbName = 'BlogPlatform';
const mongoUri = process.env.MONGO_URL;
if (!mongoUri) {
    throw new Error('URL doesn\'t found');
}
exports.BlogsModelClass = mongoose_1.default.model('blogs', types_blogs_1.blogsShema);
exports.PostsModelClass = mongoose_1.default.model('posts', types_posts_1.postsShema);
exports.UsersModelClass = mongoose_1.default.model('users', user_1.usersShema);
exports.CommentsModelClass = mongoose_1.default.model('comments', mongoosShema_1.commentsShema);
exports.LikesModelClass = mongoose_1.default.model('likes', mongoosShema_1.likeInfoShema);
exports.LikesPostsClass = mongoose_1.default.model('likes_posts', types_posts_1.likePostInfoShema);
exports.DevicesModelClass = mongoose_1.default.model('DevicesModelClass', mongoosShema_1.DevicesModelClassShema);
exports.IPAndURIModelClass = mongoose_1.default.model('IPAndURIShema', mongoosShema_1.IPAndURIShema);
const runDbMongoose = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //await client.connect();
        yield mongoose_1.default.connect(mongoUri, { dbName: "BlogPlatform" });
        console.log('Connected to db mongoose');
    }
    catch (e) {
        console.log('Don\'t connected');
        //await client.close()
        yield (0, exports.connectDisconnectDb)();
    }
});
exports.runDbMongoose = runDbMongoose;
const connectDisconnectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Don\'t connected');
    yield mongoose_1.default.connection.close();
});
exports.connectDisconnectDb = connectDisconnectDb;
