"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentMongoModel = void 0;
class CommentMongoModel {
    constructor(_id, postId, content, commentatorInfo, createdAt, likesInfo) {
        this._id = _id;
        this.postId = postId;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = createdAt;
        this.likesInfo = likesInfo;
    }
}
exports.CommentMongoModel = CommentMongoModel;
