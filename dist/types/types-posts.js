"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostMongoDb = exports.likePostInfoShema = exports.postsShema = exports.newestLikesShema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.newestLikesShema = new mongoose_1.default.Schema({
    addedAt: { type: String, required: true },
    userId: { type: String, required: true },
    login: { type: String, required: true }
}, { _id: false });
exports.postsShema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String,
        newestLikes: { type: [exports.newestLikesShema], required: true }
    }
});
exports.likePostInfoShema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    userId: { type: String, required: true },
    login: { type: String, required: true },
    postId: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: String, required: true }
});
class PostMongoDb {
    constructor(_id, title, shortDescription, content, blogId, blogName, createdAt, extendedLikesInfo) {
        this._id = _id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
        this.extendedLikesInfo = extendedLikesInfo;
    }
}
exports.PostMongoDb = PostMongoDb;
